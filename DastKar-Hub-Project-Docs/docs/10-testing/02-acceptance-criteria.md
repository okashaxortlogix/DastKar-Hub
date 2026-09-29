# Acceptance Criteria

## Product listing

Given an approved seller,
when they submit a valid product,
then the product enters the configured moderation/publishing workflow.

## Checkout

Given an available product,
when a buyer completes checkout,
then:
- an order is created exactly once,
- inventory is reserved/decremented safely,
- payment is associated,
- confirmation is generated.

## Payment webhook

Given a valid provider webhook,
when it is received twice,
then the second request does not duplicate financial state changes.

## Review

Given a delivered order,
when an eligible buyer submits a review,
then the review is linked to that order item and cannot be reused to review an unrelated product.

## Admin action

Given an admin changes a seller status,
then the action is authorized and written to the audit log.
