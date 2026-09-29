# DastKar Hub — Logistics & Courier Operations Runbook

## Overview
DastKar Hub abstracts parcel booking and tracking across leading Pakistani courier networks:
* **TCS Express:** Standard air and overland courier network.
* **Trax Logistics:** Cash-on-delivery and artisan door-to-door pickup network.

---

## 1. Booking Workflow

1. Seller prepares handcrafted items in workshop.
2. Seller navigates to Seller Dashboard -> Orders and clicks **"Book Shipment"**.
3. Seller selects carrier (`tcs` or `trax`) and confirms workshop pickup city (e.g. Multan, Chiniot, Hala, Peshawar).
4. System invokes `LogisticsService::createShipment()`, which contacts the carrier API and issues:
   * Consignment Tracking Number (e.g. `77XXXXXXXX` for TCS, `TRX-XXXXXXXX` for Trax)
   * Printable Shipping Airway Bill / Label URL
5. Order status updates to `shipped` and buyer receives an in-app notification with tracking details.

---

## 2. Ingesting Courier Status Updates

Courier webhooks are ingested at `/api/v1/webhooks/courier/{provider}`.

Supported statuses:
* `booked` -> Parcel consignment created.
* `picked_up` -> Courier rider picked up package from artisan workshop.
* `in_transit` -> Package moving through sorting hub.
* `out_for_delivery` -> Final delivery run to customer doorstep.
* `delivered` -> Customer received package. Automatically updates order `delivered_at` timestamp and triggers pending payout into seller ledger.
* `failed` / `returned` -> Delivery failed; return to artisan initiated.

---

## 3. Simulated Courier Webhook Command

```bash
curl -X POST http://127.0.0.1:8000/api/v1/webhooks/courier/tcs \
  -H "Content-Type: application/json" \
  -d '{
    "tracking_number": "7712345678",
    "status": "delivered",
    "location": "Lahore Gulberg Facility",
    "remarks": "Delivered to recipient"
  }'
```
