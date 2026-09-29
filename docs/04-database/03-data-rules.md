# Database Rules

## Money

Never use floating point for money.

Use:
- integer minor units, or
- DECIMAL with appropriate precision.

Recommended: integer minor units for internal arithmetic where practical.

## IDs

Use UUID/ULID for public-facing identifiers where appropriate.

Keep sequential internal identifiers only if operationally useful.

## Soft deletion

Use soft delete selectively:
- products
- seller profiles
- users where policy allows

Do not blindly soft-delete financial records.

## Snapshots

Order items must snapshot relevant product information at purchase time because the product can change later.

Store:
- title
- price
- variant
- customization
- relevant seller data

## State transitions

Validate transitions in the backend.

Never allow the frontend to set arbitrary status values.
