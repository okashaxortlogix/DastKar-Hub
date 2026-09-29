# API Conventions

Base:
`/api/v1`

## Response

Success:

```json
{
  "data": {},
  "meta": {}
}
```

Error:

```json
{
  "message": "Human readable message",
  "errors": {}
}
```

## Authentication

Use secure token/session architecture appropriate to deployment. Never store authentication secrets in localStorage if the selected auth architecture can use secure HttpOnly cookies.

## Pagination

```json
{
  "data": [],
  "meta": {
    "current_page": 1,
    "per_page": 24,
    "total": 240,
    "last_page": 10
  }
}
```

## HTTP semantics

GET = read
POST = create/action
PATCH = partial update
DELETE = delete/archive where appropriate

## Validation

Backend is authoritative.
Frontend validation is for UX only.

## Idempotency

Required for payment/order-sensitive endpoints where duplicate requests could create financial side effects.
