<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Order;
use App\Models\Product;
use App\Models\SellerProfile;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    private function checkAdmin(Request $request): void
    {
        if (!$request->user()->isAdmin()) {
            abort(403, 'Unauthorized access to administration console.');
        }
    }

    public function stats(Request $request): JsonResponse
    {
        $this->checkAdmin($request);

        $totalGmv = Order::whereNotIn('status', ['cancelled'])->sum('total_amount');
        $totalOrders = Order::count();
        $totalSellers = SellerProfile::count();
        $verifiedSellers = SellerProfile::whereIn('verification_status', ['verified', 'established'])->count();
        $totalBuyers = User::where('role', 'buyer')->count();
        $totalProducts = Product::count();

        $recentOrders = Order::with('buyer')->orderBy('created_at', 'desc')->take(8)->get();
        $pendingVerifications = SellerProfile::with('user')
            ->where('verification_status', 'pending')
            ->orWhere('verification_status', 'basic')
            ->orderBy('created_at', 'desc')
            ->take(8)
            ->get();

        return response()->json([
            'data' => [
                'gmv' => (float) $totalGmv,
                'orders_count' => $totalOrders,
                'sellers_count' => $totalSellers,
                'verified_sellers_count' => $verifiedSellers,
                'buyers_count' => $totalBuyers,
                'products_count' => $totalProducts,
                'recent_orders' => $recentOrders,
                'pending_verifications' => $pendingVerifications,
            ],
        ]);
    }

    public function verifySeller(Request $request, int $sellerId): JsonResponse
    {
        $this->checkAdmin($request);

        $validated = $request->validate([
            'verification_status' => 'required|string|in:basic,verified,established,rejected',
            'reason' => 'nullable|string|max:500',
        ]);

        $seller = SellerProfile::findOrFail($sellerId);
        $oldStatus = $seller->verification_status;
        $seller->update([
            'verification_status' => $validated['verification_status'],
        ]);

        AuditLog::create([
            'actor_id' => $request->user()->id,
            'action' => 'admin.verify_seller',
            'entity_type' => 'SellerProfile',
            'entity_id' => $seller->id,
            'before_json' => ['verification_status' => $oldStatus],
            'after_json' => ['verification_status' => $validated['verification_status'], 'reason' => $validated['reason'] ?? null],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return response()->json([
            'data' => $seller,
            'message' => "Seller verification status updated to {$validated['verification_status']}.",
        ]);
    }

    public function auditLogs(Request $request): JsonResponse
    {
        $this->checkAdmin($request);

        $logs = AuditLog::with('actor')->orderBy('created_at', 'desc')->paginate(20);

        return response()->json([
            'data' => $logs->items(),
            'meta' => [
                'current_page' => $logs->currentPage(),
                'total' => $logs->total(),
            ],
        ]);
    }
}
