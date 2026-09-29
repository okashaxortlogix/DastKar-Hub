<?php

namespace App\Services;

use App\Models\AuditLog;
use App\Models\Order;
use App\Models\Payout;
use App\Models\Refund;
use App\Models\SellerLedger;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class PayoutService
{
    const PLATFORM_COMMISSION_RATE = 8.00; // 8% craft marketplace commission

    /**
     * Compute and create pending payout and ledger credit for a delivered order.
     */
    public function createPendingPayoutForOrder(Order $order): array
    {
        return DB::transaction(function () use ($order) {
            $createdPayouts = [];

            // Group order items by seller
            $itemsBySeller = $order->items->groupBy(function ($item) {
                return $item->product?->seller_id;
            });

            foreach ($itemsBySeller as $sellerId => $items) {
                if (!$sellerId) {
                    continue;
                }

                // Check if payout already exists for this seller and order
                $existingPayout = Payout::where('order_id', $order->id)
                    ->where('seller_id', $sellerId)
                    ->first();

                if ($existingPayout) {
                    $createdPayouts[] = $existingPayout;
                    continue;
                }

                $grossAmount = $items->sum('subtotal');
                $commissionAmount = round(($grossAmount * (self::PLATFORM_COMMISSION_RATE / 100)), 2);
                $courierDeduction = 0.00; // seller covered or subsidized
                $refundDeduction = 0.00;
                $netPayout = round($grossAmount - $commissionAmount - $courierDeduction - $refundDeduction, 2);

                $payout = Payout::create([
                    'seller_id' => $sellerId,
                    'order_id' => $order->id,
                    'gross_amount' => $grossAmount,
                    'commission_rate' => self::PLATFORM_COMMISSION_RATE,
                    'commission_amount' => $commissionAmount,
                    'courier_fee_deduction' => $courierDeduction,
                    'refund_deduction' => $refundDeduction,
                    'net_payout' => $netPayout,
                    'currency' => 'PKR',
                    'status' => 'pending',
                    'payout_method' => 'bank_transfer',
                    'scheduled_at' => now()->addDays(3), // Standard 3-day return buffer
                ]);

                // Record credit in seller ledger
                $currentBalance = $this->getSellerBalance($sellerId);
                $newBalance = round($currentBalance + $netPayout, 2);

                SellerLedger::create([
                    'seller_id' => $sellerId,
                    'type' => 'credit',
                    'amount' => $netPayout,
                    'balance_after' => $newBalance,
                    'reference_type' => 'order',
                    'reference_id' => $order->id,
                    'description' => "Order #{$order->order_number} earnings (Gross PKR " . number_format($grossAmount, 2) . " minus " . self::PLATFORM_COMMISSION_RATE . "% commission)",
                    'created_at' => now(),
                ]);

                $createdPayouts[] = $payout;

                AuditLog::create([
                    'user_id' => null,
                    'action' => 'payout.pending_created',
                    'entity_type' => 'Payout',
                    'entity_id' => $payout->id,
                    'changes_json' => [
                        'order_id' => $order->id,
                        'gross' => $grossAmount,
                        'net' => $netPayout,
                    ],
                ]);
            }

            return $createdPayouts;
        });
    }

    /**
     * Process approved payout to seller's Raast / Bank / Wallet.
     */
    public function processPayout(Payout $payout, User $admin, ?string $notes = null): Payout
    {
        return DB::transaction(function () use ($payout, $admin, $notes) {
            $payoutRef = 'PAYOUT-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -6));

            $payout->update([
                'status' => 'paid',
                'payout_reference' => $payoutRef,
                'paid_at' => now(),
                'notes' => $notes ?? 'Disbursed via automated Raast/Bank payment.',
            ]);

            // Record debit in seller ledger
            $currentBalance = $this->getSellerBalance($payout->seller_id);
            $newBalance = round($currentBalance - $payout->net_payout, 2);

            SellerLedger::create([
                'seller_id' => $payout->seller_id,
                'type' => 'debit',
                'amount' => $payout->net_payout,
                'balance_after' => $newBalance,
                'reference_type' => 'payout',
                'reference_id' => $payout->id,
                'description' => "Disbursement payout ref: {$payoutRef}",
                'created_at' => now(),
            ]);

            // Notify seller
            $sellerUser = $payout->seller?->user;
            if ($sellerUser) {
                NotificationService::send(
                    $sellerUser->id,
                    'payout_ready',
                    'Artisan Payout Disbursed',
                    "Your payout of PKR " . number_format($payout->net_payout, 2) . " has been sent to your registered account (Ref: {$payoutRef}).",
                    "/seller/wallet",
                    ['payout_id' => $payout->id]
                );
            }

            AuditLog::create([
                'user_id' => $admin->id,
                'action' => 'payout.disbursed',
                'entity_type' => 'Payout',
                'entity_id' => $payout->id,
                'changes_json' => [
                    'amount' => $payout->net_payout,
                    'reference' => $payoutRef,
                ],
            ]);

            return $payout;
        });
    }

    /**
     * Deduct refund from seller ledger.
     */
    public function deductRefund(Refund $refund, int $sellerId): void
    {
        DB::transaction(function () use ($refund, $sellerId) {
            $currentBalance = $this->getSellerBalance($sellerId);
            $newBalance = round($currentBalance - $refund->amount, 2);

            SellerLedger::create([
                'seller_id' => $sellerId,
                'type' => 'debit',
                'amount' => $refund->amount,
                'balance_after' => $newBalance,
                'reference_type' => 'refund',
                'reference_id' => $refund->id,
                'description' => "Deduction for refund #{$refund->id} on order #{$refund->order_id}",
                'created_at' => now(),
            ]);
        });
    }

    /**
     * Get real-time ledger balance for a seller.
     */
    public function getSellerBalance(int $sellerId): float
    {
        $lastEntry = SellerLedger::where('seller_id', $sellerId)
            ->latest('id')
            ->first();

        return $lastEntry ? (float) $lastEntry->balance_after : 0.00;
    }
}
