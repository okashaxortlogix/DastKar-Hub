<?php

namespace App\Services\Payment;

use App\Models\Order;
use App\Models\Payment;

class CodGateway implements PaymentGatewayInterface
{
    public function createPayment(Order $order, array $params = []): array
    {
        $reference = 'COD-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -6));

        return [
            'status' => 'pending',
            'provider' => 'cod',
            'provider_reference' => $reference,
            'amount' => $order->total_amount,
            'currency' => 'PKR',
            'redirect_url' => null,
            'metadata' => [
                'type' => 'Cash On Delivery',
                'settlement' => 'Upon Courier Delivery',
            ],
        ];
    }

    public function verifyPayment(string $reference, array $payload = []): array
    {
        return [
            'is_paid' => ($payload['status'] ?? '') === 'paid',
            'status' => $payload['status'] ?? 'pending',
            'provider_reference' => $reference,
        ];
    }

    public function refundPayment(Payment $payment, float $amount, string $reason = ''): array
    {
        return [
            'success' => true,
            'refund_reference' => 'REF-COD-' . uniqid(),
            'amount' => $amount,
            'status' => 'completed',
        ];
    }

    public function parseWebhook(array $payload, string $signature = ''): array
    {
        return [
            'valid' => true,
            'order_reference' => $payload['order_number'] ?? null,
            'status' => $payload['status'] ?? 'pending',
        ];
    }
}
