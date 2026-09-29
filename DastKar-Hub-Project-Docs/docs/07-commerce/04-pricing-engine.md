# Pricing Engine

## Inputs

- product price
- quantity
- variants
- customization charges
- seller discounts
- platform promotions
- shipping
- applicable taxes/fees

## Output

- subtotal
- discount
- shipping
- tax/fee
- total

## Rule

Pricing must be calculated server-side.

Frontend may display estimates but cannot be trusted.

## Snapshot

At order placement, persist the price components used for the order.
