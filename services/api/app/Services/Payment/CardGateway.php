<?php

namespace App\Services\Payment;

use App\Models\Order;
use App\Models\Payment;

class CardGateway implements PaymentGatewayInterface
{
    public function createPayment(Order $order, array $params = []): array
    {
        $ref = 'CARD-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -6));

        return [
            'status' => 'pending',
            'provider' => 'card',
            'provider_reference' => $ref,
            'amount' => $order->total_amount,
            'currency' => 'PKR',
            'redirect_url' => "https://secure-pay.dastkarhub.pk/pay/{$ref}",
            'metadata' => [
                'type' => 'Visa / Mastercard / 1Link PayPak',
                '3d_secure' => true,
            ],
        ];
    }

    public function verifyPayment(string $reference, array $payload = []): array
    {
        $isPaid = ($payload['status'] ?? 'paid') === 'paid';
        return [
            'is_paid' => $isPaid,
            'status' => $isPaid ? 'paid' : 'failed',
            'provider_reference' => $reference,
        ];
    }

    public function refundPayment(Payment $payment, float $amount, string $reason = ''): array
    {
        return [
            'success' => true,
            'refund_reference' => 'REF-CARD-' . uniqid(),
            'amount' => $amount,
            'status' => 'completed',
        ];
    }

    public function parseWebhook(array $payload, string $signature = ''): array
    {
        return [
            'valid' => true,
            'order_reference' => $payload['order_number'] ?? null,
            'provider_reference' => $payload['provider_reference'] ?? null,
            'is_paid' => ($payload['status'] ?? '') === 'paid',
            'status' => $payload['status'] ?? 'pending',
        ];
    }
}
