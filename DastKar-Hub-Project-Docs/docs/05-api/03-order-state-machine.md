# Order State Machine

## States

pending_payment
paid
confirmed
processing
ready_to_ship
shipped
out_for_delivery
delivered
completed
cancelled
failed
return_requested
returned
refunded
disputed

## Rules

- Payment state and order state are separate.
- Only valid transitions are allowed.
- Delivered does not necessarily mean immediately paid out if a protection/settlement period applies.
- Cancellation after production/shipping requires explicit policy rules.
- Every financial state transition is auditable.

## Example

paid → confirmed → processing → ready_to_ship → shipped → out_for_delivery → delivered → completed
