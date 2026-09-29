# Payments & Payouts

## Architecture

Customer → payment provider → DastKar order/payment record → settlement → seller payout.

## Payment statuses

initiated
pending
authorized
paid
failed
cancelled
refunded
partially_refunded

## Payout statuses

pending
scheduled
processing
paid
failed
held

## Reconciliation

Daily reconciliation should compare:
- DastKar orders
- payment provider transactions
- refunds
- fees
- seller payouts

Any mismatch enters an operations queue.

## Provider abstraction

Create a Laravel payment interface so provider-specific logic is isolated.

Example conceptual interface:

```text
PaymentGateway
  createPayment()
  verifyPayment()
  refundPayment()
  parseWebhook()
```

This prevents the whole system from depending on one provider.
