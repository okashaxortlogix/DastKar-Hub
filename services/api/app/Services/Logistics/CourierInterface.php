<?php

namespace App\Services\Logistics;

use App\Models\Order;

interface CourierInterface
{
    /**
     * Book a shipment with the courier partner.
     */
    public function bookShipment(Order $order, array $params = []): array;

    /**
     * Track a consignment by tracking number.
     */
    public function trackShipment(string $trackingNumber): array;

    /**
     * Cancel an active booking.
     */
    public function cancelShipment(string $trackingNumber): array;

    /**
     * Parse incoming status webhook from courier partner.
     */
    public function parseWebhook(array $payload, string $signature = ''): array;
}
