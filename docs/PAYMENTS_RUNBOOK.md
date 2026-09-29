# DastKar Hub — Payments Runbook

## Overview
DastKar Hub integrates Pakistani digital payment systems (JazzCash, Easypaisa, 1Link PayPak, Cards, Cash on Delivery) through a provider abstraction (`PaymentGatewayInterface`).

---

## 1. Supported Payment Channels & Workflows

1. **Cash on Delivery (COD):**
   * Default method for Pakistani buyers.
   * Payment marked `pending` upon checkout; marked `paid` when courier collects cash and updates webhook.
2. **JazzCash / Easypaisa Mobile Wallets:**
   * Payment initiated with HMAC-SHA256 signature generated using `JAZZCASH_INTEGRITY_SALT`.
   * Webhook callback received at `/api/v1/webhooks/payment/jazzcash`.
   * Status validated against merchant secret and signature.
3. **Credit / Debit Cards (1Link / PayPak / Visa / Mastercard):**
   * Routed via 3D Secure payment gateway.
   * Tokenized callback updates payment and order status.

---

## 2. Webhook Testing & Reconciliation

To test payment webhook ingestion locally or in staging:

```bash
curl -X POST http://127.0.0.1:8000/api/v1/webhooks/payment/jazzcash \
  -H "Content-Type: application/json" \
  -d '{
    "pp_TxnRefNo": "TXN-TEST-123456",
    "pp_BillReference": "ORD-2026-XXXXX",
    "pp_ResponseCode": "000",
    "pp_Amount": "15350.00",
    "status": "paid",
    "test_mode": true
  }'
```

---

## 3. Discrepancy & Refund Resolution

* If a customer is charged but the order was not marked paid due to upstream timeout:
  1. Inspect provider dashboard (JazzCash / Easypaisa portal) for transaction reference.
  2. Locate payment record in database: `Payment::where('provider_reference', $ref)->first()`.
  3. Replay webhook or trigger manual verification via `PaymentService::handleWebhook()`.
* Refunds are issued through the dispute resolution console (`/api/v1/admin/disputes/{id}/resolve`) which automatically creates a `Refund` record and adjusts the seller's ledger.
