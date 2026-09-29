<?php

namespace App\Services\Payment;

use App\Models\Order;
use App\Models\Payment;

interface PaymentGatewayInterface
{
    /**
     * Initiate payment transaction
     */
    public function createPayment(Order $order, array $params = []): array;

    /**
     * Verify payment status with provider
     */
    public function verifyPayment(string $reference, array $payload = []): array;

    /**
     * Issue full or partial refund
     */
    public function refundPayment(Payment $payment, float $amount, string $reason = ''): array;

    /**
     * Parse and validate webhook payload and signature
     */
    public function parseWebhook(array $payload, string $signature = ''): array;
}
