<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Services\LogisticsService;
use App\Services\PaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WebhookController extends Controller
{
    protected PaymentService $paymentService;
    protected LogisticsService $logisticsService;

    public function __construct(PaymentService $paymentService, LogisticsService $logisticsService)
    {
        $this->paymentService = $paymentService;
        $this->logisticsService = $logisticsService;
    }

    /**
     * Ingest payment webhook from gateways (JazzCash, EasyPaisa, Card).
     */
    public function paymentWebhook(Request $request, string $provider): JsonResponse
    {
        $payload = $request->all();
        $signature = $request->header('X-Signature', $request->header('pp_SecureHash', ''));

        $result = $this->paymentService->handleWebhook($provider, $payload, $signature);

        return response()->json([
            'success' => $result['success'],
            'message' => $result['message'],
            'order_number' => $result['order_number'] ?? null,
        ], $result['status_code'] ?? 200);
    }

    /**
     * Ingest courier status webhook from logistics partners (TCS, Trax).
     */
    public function courierWebhook(Request $request, string $provider): JsonResponse
    {
        $payload = $request->all();
        $signature = $request->header('X-Courier-Signature', '');

        $result = $this->logisticsService->handleWebhook($provider, $payload, $signature);

        return response()->json([
            'success' => $result['success'],
            'message' => $result['message'],
            'tracking_number' => $result['tracking_number'] ?? null,
            'status' => $result['status'] ?? null,
        ], $result['status_code'] ?? 200);
    }
}
