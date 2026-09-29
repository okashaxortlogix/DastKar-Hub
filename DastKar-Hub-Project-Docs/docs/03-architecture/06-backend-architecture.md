# Laravel Backend Architecture

## Layers

Controller
→ Request validation
→ Application/Domain service
→ Model/repository where appropriate
→ transaction
→ event/job
→ response resource

## Controllers

Controllers should:
- authorize
- validate through Form Requests
- call application services
- return Resources

Avoid putting pricing, inventory, payout or order rules directly in controllers.

## Services

Examples:
- CheckoutService
- OrderService
- InventoryService
- PaymentService
- PayoutService
- VerificationService
- DisputeService
- ShippingService

## Jobs

Examples:
- ProcessProductImage
- SendOrderNotification
- SyncShipment
- ProcessPaymentWebhook
- GenerateAIListing
- RebuildSearchIndex

## Events

Examples:
- OrderPlaced
- PaymentCompleted
- OrderDelivered
- SellerVerified
- ReviewCreated
