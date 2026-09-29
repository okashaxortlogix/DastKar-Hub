<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\Payout;
use App\Models\SellerLedger;
use App\Services\PayoutService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PayoutController extends Controller
{
    protected PayoutService $payoutService;

    public function __construct(PayoutService $payoutService)
    {
        $this->payoutService = $payoutService;
    }

    /**
     * Seller: view wallet balance, ledger transactions and payout history
     */
    public function sellerPayouts(Request $request): JsonResponse
    {
        $seller = $request->user()->sellerProfile;
        if (!$seller) {
            return response()->json(['message' => 'Seller profile required.'], 403);
        }

        $balance = $this->payoutService->getSellerBalance($seller->id);

        $payouts = Payout::with('order')
            ->where('seller_id', $seller->id)
            ->latest()
            ->paginate(15);

        $ledger = SellerLedger::where('seller_id', $seller->id)
            ->latest('id')
            ->limit(20)
            ->get();

        return response()->json([
            'data' => [
                'current_balance_pkr' => $balance,
                'currency' => 'PKR',
                'payouts' => $payouts->items(),
                'recent_ledger_entries' => $ledger,
            ],
            'meta' => [
                'current_page' => $payouts->currentPage(),
                'total_payouts' => $payouts->total(),
            ],
        ]);
    }

    /**
     * Admin: list all pending and disbursed payouts
     */
    public function adminPayouts(Request $request): JsonResponse
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Admin authorization required.'], 403);
        }

        $status = $request->query('status');
        $query = Payout::with(['seller.user', 'order']);

        if ($status) {
            $query->where('status', $status);
        }

        $payouts = $query->latest()->paginate(20);

        return response()->json([
            'data' => $payouts->items(),
            'meta' => [
                'current_page' => $payouts->currentPage(),
                'total' => $payouts->total(),
            ],
        ]);
    }

    /**
     * Admin: disburse pending payout
     */
    public function disburse(Request $request, int $id): JsonResponse
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Admin authorization required.'], 403);
        }

        $validated = $request->validate([
            'notes' => 'nullable|string|max:500',
        ]);

        $payout = Payout::with('seller.user')->findOrFail($id);

        if ($payout->status === 'paid') {
            return response()->json(['message' => 'This payout has already been disbursed.'], 400);
        }

        $disbursed = $this->payoutService->processPayout(
            $payout,
            $request->user(),
            $validated['notes'] ?? null
        );

        return response()->json([
            'data' => $disbursed,
            'message' => 'Payout disbursed successfully and recorded in seller financial ledger.',
        ]);
    }
}
