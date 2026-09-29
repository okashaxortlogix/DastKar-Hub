# Logistics & Returns

## Shipping architecture

DastKar → courier adapter → courier API.

Each courier adapter should support where available:
- create shipment
- tracking
- cancellation
- pickup
- delivery status
- return-to-origin
- shipping label

## Shipment states

pending
booked
picked_up
in_transit
out_for_delivery
delivered
failed
returned

## Returns

Return request:
requested → under_review → approved/rejected → pickup → received → inspected → refunded/replaced → closed

## RTO

Track RTO by:
- seller
- buyer
- courier
- region
- payment type
- product category

## Packaging

Start with seller responsibility plus guidelines.
Introduce optional branded DastKar packaging later.
