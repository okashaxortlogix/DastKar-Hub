<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\Order;
use App\Models\Review;
use App\Services\CheckoutService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    protected CheckoutService $checkoutService;

    public function __construct(CheckoutService $checkoutService)
    {
        $this->checkoutService = $checkoutService;
    }

    /**
     * Revalidate cart and calculate pricing quote authoritatively
     */
    public function quote(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.variant_id' => 'nullable|exists:product_variants,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.customization' => 'nullable|array',
            'shipping_method' => 'nullable|string|in:standard,express',
        ]);

        $quote = $this->checkoutService->calculateQuote(
            $validated['items'],
            $validated['shipping_method'] ?? 'standard'
        );

        return response()->json([
            'data' => $quote,
        ]);
    }

    /**
     * Process checkout and save immutable order
     */
    public function checkout(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.variant_id' => 'nullable|exists:product_variants,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.customization' => 'nullable|array',
            'shipping_method' => 'nullable|string|in:standard,express',
            'payment_method' => 'required|string|in:cod,jazzcash_easypaisa,card,bank_transfer',
            'shipping_address' => 'required|array',
            'shipping_address.full_name' => 'required|string|max:100',
            'shipping_address.phone' => 'required|string|max:25',
            'shipping_address.address_line1' => 'required|string|max:250',
            'shipping_address.city' => 'required|string|max:100',
            'shipping_address.postal_code' => 'nullable|string|max:20',
            'notes' => 'nullable|string|max:500',
        ]);

        $order = $this->checkoutService->createOrder($request->user(), $validated);

        return response()->json([
            'data' => $order,
            'message' => 'Order placed successfully.',
        ], 201);
    }

    /**
     * Buyer orders list
     */
    public function index(Request $request): JsonResponse
    {
        $orders = Order::with(['items.seller', 'payments'])
            ->where('buyer_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json([
            'data' => $orders->items(),
            'meta' => [
                'current_page' => $orders->currentPage(),
                'total' => $orders->total(),
            ],
        ]);
    }

    /**
     * View single order by order_number
     */
    public function show(Request $request, string $orderNumber): JsonResponse
    {
        $user = $request->user();
        $query = Order::with(['items.seller', 'payments'])->where('order_number', $orderNumber);

        if (!$user->isAdmin()) {
            $query->where('buyer_id', $user->id);
        }

        $order = $query->firstOrFail();

        return response()->json([
            'data' => $order,
        ]);
    }

    /**
     * Submit review for delivered product in an order
     */
    public function submitReview(Request $request, string $orderNumber): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|min:10|max:1000',
        ]);

        $user = $request->user();
        $order = Order::where('order_number', $orderNumber)
            ->where('buyer_id', $user->id)
            ->firstOrFail();

        $item = $order->items()->where('product_id', $validated['product_id'])->firstOrFail();

        // Security check: Prevent review spamming / duplicate reviews
        $existingReview = Review::where('order_id', $order->id)
            ->where('product_id', $validated['product_id'])
            ->first();

        if ($existingReview) {
            return response()->json([
                'message' => 'You have already submitted a review for this product in this order.',
            ], 422);
        }

        // Neutralize potential Stored XSS attacks
        $sanitizedComment = htmlspecialchars(strip_tags($validated['comment']), ENT_QUOTES, 'UTF-8');

        $review = Review::create([
            'order_id' => $order->id,
            'buyer_id' => $user->id,
            'seller_id' => $item->seller_id,
            'product_id' => $validated['product_id'],
            'rating' => $validated['rating'],
            'comment' => $sanitizedComment,
            'status' => 'published',
        ]);

        // Increment product review count and update average
        $avgRating = Review::where('product_id', $validated['product_id'])->avg('rating') ?: $validated['rating'];
        $count = Review::where('product_id', $validated['product_id'])->count();
        $item->product?->update([
            'rating_average' => round($avgRating, 2),
            'rating_count' => $count,
        ]);

        return response()->json([
            'data' => $review,
            'message' => 'Thank you for supporting Pakistani artisans with your review!',
        ], 201);
    }

    /**
     * User addresses
     */
    public function addresses(Request $request): JsonResponse
    {
        $addresses = Address::where('user_id', $request->user()->id)->get();

        return response()->json(['data' => $addresses]);
    }

    public function saveAddress(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:100',
            'phone' => 'required|string|max:25',
            'address_line1' => 'required|string|max:250',
            'address_line2' => 'nullable|string|max:250',
            'city' => 'required|string|max:100',
            'state_province' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'is_default' => 'nullable|boolean',
        ]);

        if (!empty($validated['is_default'])) {
            Address::where('user_id', $request->user()->id)->update(['is_default' => false]);
        }

        $address = Address::create(array_merge($validated, [
            'user_id' => $request->user()->id,
            'country' => 'Pakistan',
        ]));

        return response()->json(['data' => $address, 'message' => 'Address saved.'], 201);
    }
}
