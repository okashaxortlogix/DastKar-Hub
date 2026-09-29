# API Endpoint Blueprint

## Auth

POST `/auth/register`
POST `/auth/login`
POST `/auth/logout`
POST `/auth/forgot-password`
POST `/auth/reset-password`
GET `/auth/me`

## Catalog

GET `/categories`
GET `/products`
GET `/products/{slug}`
GET `/makers/{slug}`
GET `/makers/{slug}/products`
GET `/search`

## Cart

GET `/cart`
POST `/cart/items`
PATCH `/cart/items/{id}`
DELETE `/cart/items/{id}`

## Checkout

POST `/checkout/quote`
POST `/orders`
GET `/orders`
GET `/orders/{orderNumber}`

## Payments

POST `/payments/initiate`
POST `/payments/webhook/{provider}`

## Reviews

POST `/orders/{orderNumber}/reviews`
PATCH `/reviews/{id}`
POST `/reviews/{id}/response`

## Seller

GET `/seller/dashboard`
GET `/seller/products`
POST `/seller/products`
PATCH `/seller/products/{id}`
POST `/seller/products/{id}/publish`
POST `/seller/products/{id}/pause`
GET `/seller/orders`
GET `/seller/orders/{id}`
PATCH `/seller/orders/{id}/status`
GET `/seller/inventory`
GET `/seller/payouts`
GET `/seller/analytics`

## Verification

GET `/seller/verification`
POST `/seller/verification`
POST `/seller/verification/documents`

## Admin

GET `/admin/dashboard`
GET `/admin/sellers`
PATCH `/admin/sellers/{id}/status`
GET `/admin/verifications`
POST `/admin/verifications/{id}/approve`
POST `/admin/verifications/{id}/reject`
GET `/admin/orders`
GET `/admin/disputes`
PATCH `/admin/disputes/{id}`
GET `/admin/audit-logs`
