<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\Dispute;
use App\Models\Order;
use App\Services\DisputeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DisputeController extends Controller
{
    protected DisputeService $disputeService;

    public function __construct(DisputeService $disputeService)
    {
        $this->disputeService = $disputeService;
    }

    /**
     * Buyer: list my disputes
     */
    public function index(Request $request): JsonResponse
    {
        $disputes = Dispute::with(['order', 'seller'])
            ->where('buyer_id', $request->user()->id)
            ->latest()
            ->paginate(10);

        return response()->json([
            'data' => $disputes->items(),
            'meta' => [
                'current_page' => $disputes->currentPage(),
                'total' => $disputes->total(),
            ],
        ]);
    }

    /**
     * Buyer: open a dispute on an order
     */
    public function store(Request $request, string $orderNumber): JsonResponse
    {
        $validated = $request->validate([
            'reason' => 'required|string|in:damaged_in_transit,wrong_item,quality_mismatch,not_delivered',
            'description' => 'required|string|min:15|max:2000',
            'evidence_images' => 'nullable|array',
            'evidence_images.*' => 'string|url',
        ]);

        $order = Order::where('order_number', $orderNumber)->firstOrFail();

        $dispute = $this->disputeService->createDispute($request->user(), $order, $validated);

        return response()->json([
            'data' => $dispute,
            'message' => 'Dispute opened successfully. The maker and support team have been notified.',
        ], 201);
    }

    /**
     * Seller: list disputes involving seller products
     */
    public function sellerDisputes(Request $request): JsonResponse
    {
        $seller = $request->user()->sellerProfile;
        if (!$seller) {
            return response()->json(['message' => 'Seller profile required.'], 403);
        }

        $disputes = Dispute::with(['order', 'buyer'])
            ->where('seller_id', $seller->id)
            ->latest()
            ->paginate(15);

        return response()->json([
            'data' => $disputes->items(),
            'meta' => [
                'current_page' => $disputes->currentPage(),
                'total' => $disputes->total(),
            ],
        ]);
    }

    /**
     * Admin: list all disputes across the marketplace
     */
    public function adminDisputes(Request $request): JsonResponse
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Admin authorization required.'], 403);
        }

        $status = $request->query('status');
        $query = Dispute::with(['order', 'buyer', 'seller.user']);

        if ($status) {
            $query->where('status', $status);
        }

        $disputes = $query->latest()->paginate(20);

        return response()->json([
            'data' => $disputes->items(),
            'meta' => [
                'current_page' => $disputes->currentPage(),
                'total' => $disputes->total(),
            ],
        ]);
    }

    /**
     * Admin: resolve a dispute
     */
    public function resolve(Request $request, int $id): JsonResponse
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Admin authorization required.'], 403);
        }

        $validated = $request->validate([
            'resolution' => 'required|string|in:refund_full,refund_partial,rejected,replacement',
            'amount' => 'required_if:resolution,refund_full,refund_partial|numeric|min:0',
            'admin_notes' => 'nullable|string|max:1000',
        ]);

        $dispute = Dispute::with('order')->findOrFail($id);

        $resolved = $this->disputeService->resolveDispute(
            $dispute,
            $validated['resolution'],
            (float) ($validated['amount'] ?? 0),
            $validated['admin_notes'] ?? null,
            $request->user()
        );

        return response()->json([
            'data' => $resolved,
            'message' => 'Dispute resolved and appropriate ledger adjustments/refunds recorded.',
        ]);
    }
}
