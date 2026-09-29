# Product Requirements Document (PRD)

## 1. Product

DastKar Hub — maker-first marketplace.

## 2. MVP objective

Enable a verified maker to create a storefront and sell products to a customer who can discover, purchase, receive and review those products.

## 3. MVP users

### Buyer
Needs to:
- browse
- search
- filter
- inspect maker/product
- customize where supported
- checkout
- track
- review

### Maker
Needs to:
- register
- submit verification
- create storefront
- list products
- manage inventory
- receive orders
- update fulfillment
- view basic analytics

### Admin
Needs to:
- verify sellers
- moderate products
- manage orders/disputes
- manage categories
- inspect payments/payouts
- suspend accounts
- review platform metrics

## 4. Functional requirements

### Authentication
- email/phone authentication
- secure password handling
- optional OTP
- password reset
- session/token management
- role-based access

### Seller onboarding
- account creation
- profile
- identity information
- maker evidence
- bank/payout information as required
- verification status
- approval/rejection/revision workflow

### Storefront
- maker name
- profile image
- cover
- story
- craft/category
- location at safe granularity
- verification badge
- product catalog
- ratings/reviews

### Product
- title
- description
- images
- category
- price
- variants
- inventory
- production time
- shipping weight/dimensions
- customization options
- return eligibility
- status

### Catalog
- categories
- subcategories
- filters
- sorting
- search
- pagination/infinite loading

### Cart
- add/remove
- quantity
- variant
- customization
- price calculation
- shipping estimate

### Checkout
- address
- shipping method
- payment method
- order summary
- terms/policy confirmation

### Orders
- order creation
- order state
- seller fulfillment
- shipment tracking
- cancellation
- refund
- review eligibility

### Reviews
- verified-purchase reviews
- rating
- text
- images optional
- seller response
- moderation

### Admin
- seller verification
- product moderation
- order search
- dispute queue
- refund management
- category management
- promotion management
- audit logs

## 5. Non-functional requirements

- responsive from 320px upward
- accessible keyboard navigation
- fast initial load
- server-side pagination
- image optimization
- API authorization on every protected resource
- database transactions for critical order/payment changes
- audit logging for privileged actions
- automated backups
- monitoring

## 6. MVP exclusions

- full social feed
- native mobile apps
- advanced visual search
- AI video generation
- international checkout
- B2B procurement
- complex recommendation ML
- marketplace-wide chat
- internal courier fleet

## 7. Success criteria

The MVP is successful if real users demonstrate:
- seller activation
- real transactions
- successful fulfillment
- buyer trust
- repeat usage
- measurable positive/near-positive contribution economics after controlled acquisition assumptions
