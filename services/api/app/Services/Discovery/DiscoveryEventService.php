<?php

namespace App\Services\Discovery;

use App\Models\DiscoveryEvent;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DiscoveryEventService
{
    /**
     * Record a discovery event with anti-abuse deduplication.
     */
    public function recordEvent(
        string $eventType,
        string $surface,
        ?int $productId = null,
        ?int $sellerId = null,
        ?int $categoryId = null,
        ?int $position = null,
        ?int $userId = null,
        ?string $sessionId = null,
        ?array $metadata = null
    ): ?DiscoveryEvent {
        // Prevent sellers from generating self-clicks/impressions to artificially boost rank
        if ($userId && $sellerId && $productId) {
            $product = Product::find($productId);
            if ($product && $product->seller && $product->seller->user_id === $userId) {
                // Ignore self-generated ranking signal
                return null;
            }
        }

        // Debounce deduplication: avoid counting rapid consecutive refreshes within 5 minutes
        if ($sessionId && $productId && in_array($eventType, ['product_impression', 'product_click'], true)) {
            $recentDuplicate = DiscoveryEvent::where('session_id', $sessionId)
                ->where('event_type', $eventType)
                ->where('product_id', $productId)
                ->where('created_at', '>=', Carbon::now()->subMinutes(5))
                ->exists();

            if ($recentDuplicate) {
                return null;
            }
        }

        $event = DiscoveryEvent::create([
            'event_type' => $eventType,
            'surface' => $surface,
            'position' => $position,
            'product_id' => $productId,
            'seller_id' => $sellerId,
            'category_id' => $categoryId,
            'user_id' => $userId,
            'session_id' => $sessionId,
            'metadata' => $metadata,
            'created_at' => Carbon::now(),
        ]);

        // Increment aggregate metric on product atomically
        if ($productId) {
            $this->incrementProductMetric($productId, $eventType);
        }

        return $event;
    }

    private function incrementProductMetric(int $productId, string $eventType): void
    {
        $column = match ($eventType) {
            'product_impression', 'search_result_impression', 'category_product_impression' => 'impressions_count',
            'product_click', 'search_result_click' => 'clicks_count',
            'add_to_wishlist' => 'wishlist_count',
            'purchase' => 'sales_count',
            default => null,
        };

        if ($column) {
            Product::where('id', $productId)->increment($column);
        }
    }
}
