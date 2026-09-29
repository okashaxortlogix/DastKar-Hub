<?php

namespace App\Services;

use App\Models\AuditLog;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Refund;
use App\Services\Payment\CardGateway;
use App\Services\Payment\CodGateway;
use App\Services\Payment\JazzCashEasypaisaGateway;
use App\Services\Payment\PaymentGatewayInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PaymentService
{
    /**
     * Resolve the payment gateway implementation based on method code.
     */
    public function resolveGateway(string $method): PaymentGatewayInterface
    {
        return match (strtolower($method)) {
            'cod', 'cash_on_delivery' => new CodGateway(),
            'card', 'credit_card', 'debit_card' => new CardGateway(),
            'jazzcash', 'easypaisa', 'jazzcash_easypaisa', 'wallet' => new JazzCashEasypaisaGateway(),
            default => new CodGateway(),
        };
    }

    /**
     * Initiate payment for an order.
     */
    public function initiatePayment(Order $order, string $method, array $params = []): array
    {
        $gateway = $this->resolveGateway($method);
        $result = $gateway->createPayment($order, $params);

        $payment = Payment::updateOrCreate(
            ['order_id' => $order->id],
            [
                'provider' => $method,
                'status' => $result['status'] ?? 'pending',
                'amount' => $order->total_amount,
                'currency' => 'PKR',
                'provider_reference' => $result['provider_reference'] ?? null,
                'metadata_json' => $result,
            ]
        );

        if ($result['status'] === 'paid') {
            $payment->update(['paid_at' => now()]);
            $order->update([
                'payment_status' => 'paid',
                'status' => 'confirmed',
            ]);
        }

        return [
            'payment' => $payment,
            'gateway_result' => $result,
        ];
    }

    /**
     * Handle payment webhook from payment gateways with idempotency protection.
     */
    public function handleWebhook(string $provider, array $payload, string $signature = ''): array
    {
        Log::info("Payment webhook received from provider: {$provider}", ['payload' => $payload]);

        $gateway = $this->resolveGateway($provider);
        $parsed = $gateway->parseWebhook($payload, $signature);

        if (!($parsed['valid'] ?? false)) {
            Log::warning("Payment webhook signature validation failed for provider {$provider}");
            return [
                'success' => false,
                'message' => 'Invalid webhook signature or parameters',
                'status_code' => 400,
            ];
        }

        $orderNumber = $parsed['order_reference'] ?? null;
        $providerRef = $parsed['provider_reference'] ?? null;

        $order = null;
        if ($orderNumber) {
            $order = Order::where('order_number', $orderNumber)->first();
        }
        if (!$order && $providerRef) {
            $payment = Payment::where('provider_reference', $providerRef)->first();
            if ($payment) {
                $order = $payment->order;
            }
        }

        if (!$order) {
            return [
                'success' => false,
                'message' => 'Matching order not found',
                'status_code' => 404,
            ];
        }

        // Idempotency check: if order is already marked paid, return success without duplicate actions
        if ($order->payment_status === 'paid' && $parsed['is_paid']) {
            return [
                'success' => true,
                'message' => 'Order is already marked as paid (Idempotent)',
                'order_number' => $order->order_number,
                'status_code' => 200,
            ];
        }

        DB::transaction(function () use ($order, $parsed, $provider) {
            $payment = Payment::firstOrCreate(['order_id' => $order->id], [
                'provider' => $provider,
                'amount' => $order->total_amount,
                'currency' => 'PKR',
            ]);

            if ($parsed['is_paid']) {
                $payment->update([
                    'status' => 'paid',
                    'provider_reference' => $parsed['provider_reference'] ?? $payment->provider_reference,
                    'paid_at' => now(),
                    'metadata_json' => $parsed,
                ]);

                $order->update([
                    'payment_status' => 'paid',
                    'status' => 'confirmed',
                ]);

                // Notify buyer
                NotificationService::send(
                    $order->buyer_id,
                    'payment_success',
                    'Payment Confirmed',
                    "Your payment of PKR " . number_format($order->total_amount) . " for order #{$order->order_number} was successfully verified.",
                    "/account/orders/{$order->order_number}",
                    ['order_id' => $order->id]
                );

                AuditLog::create([
                    'user_id' => $order->buyer_id,
                    'action' => 'payment.verified',
                    'entity_type' => 'Order',
                    'entity_id' => $order->id,
                    'changes_json' => [
                        'provider' => $provider,
                        'reference' => $parsed['provider_reference'] ?? null,
                        'amount' => $order->total_amount,
                    ],
                ]);
            } else {
                $payment->update([
                    'status' => 'failed',
                    'gateway_response_json' => $parsed,
                ]);
                $order->update(['payment_status' => 'failed']);
            }
        });

        return [
            'success' => true,
            'message' => 'Webhook processed successfully',
            'order_number' => $order->order_number,
            'status_code' => 200,
        ];
    }

    /**
     * Process a refund through the gateway and record audit log.
     */
    public function processRefund(Order $order, float $amount, string $reason = '', ?int $disputeId = null): Refund
    {
        return DB::transaction(function () use ($order, $amount, $reason, $disputeId) {
            $payment = $order->payment;
            $gateway = $this->resolveGateway($payment?->provider ?? 'cod');

            $gatewayResult = $payment ? $gateway->refundPayment($payment, $amount, $reason) : ['success' => true, 'refund_reference' => 'COD-REF-' . uniqid()];

            $refund = Refund::create([
                'order_id' => $order->id,
                'payment_id' => $payment?->id,
                'dispute_id' => $disputeId,
                'amount' => $amount,
                'currency' => 'PKR',
                'reason' => $reason,
                'status' => ($gatewayResult['success'] ?? true) ? 'completed' : 'failed',
                'provider_reference' => $gatewayResult['refund_reference'] ?? null,
                'processed_at' => now(),
            ]);

            // Update order status if refund is equal or greater than total amount
            $totalRefunded = Refund::where('order_id', $order->id)->where('status', 'completed')->sum('amount');
            if ($totalRefunded >= $order->total_amount) {
                $order->update(['status' => 'refunded', 'payment_status' => 'refunded']);
            } else {
                $order->update(['status' => 'partially_refunded']);
            }

            AuditLog::create([
                'user_id' => auth()->id() ?? $order->buyer_id,
                'action' => 'payment.refunded',
                'entity_type' => 'Refund',
                'entity_id' => $refund->id,
                'changes_json' => [
                    'order_id' => $order->id,
                    'amount' => $amount,
                    'reason' => $reason,
                ],
            ]);

            return $refund;
        });
    }
}
