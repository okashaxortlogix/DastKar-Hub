# Entity Relationship Diagram

## Core relationships

```text
User
 ├── SellerProfile
 │    ├── Verification
 │    ├── Storefront
 │    ├── Products
 │    │    ├── ProductVariants
 │    │    ├── ProductImages
 │    │    └── CustomizationOptions
 │    ├── Orders
 │    └── Payouts
 │
 ├── Addresses
 ├── Cart
 ├── Orders
 ├── Reviews
 └── Disputes

Product
 ├── Category
 ├── Maker/Seller
 ├── Variants
 ├── Images
 ├── CustomizationOptions
 └── Reviews

Order
 ├── OrderItems
 ├── Payment
 ├── Shipment
 ├── Refunds
 ├── Dispute
 └── Review eligibility
```

## Mermaid ERD

```mermaid
erDiagram
    USERS ||--o| SELLER_PROFILES : has
    SELLER_PROFILES ||--o| VERIFICATIONS : has
    SELLER_PROFILES ||--o| STOREFRONTS : owns
    SELLER_PROFILES ||--o{ PRODUCTS : lists
    CATEGORIES ||--o{ PRODUCTS : contains
    PRODUCTS ||--o{ PRODUCT_VARIANTS : has
    PRODUCTS ||--o{ PRODUCT_IMAGES : has
    PRODUCTS ||--o{ CUSTOMIZATION_OPTIONS : supports
    USERS ||--o{ ADDRESSES : has
    USERS ||--o| CARTS : owns
    CARTS ||--o{ CART_ITEMS : contains
    PRODUCTS ||--o{ CART_ITEMS : referenced
    USERS ||--o{ ORDERS : places
    ORDERS ||--o{ ORDER_ITEMS : contains
    PRODUCTS ||--o{ ORDER_ITEMS : references
    ORDERS ||--o| PAYMENTS : has
    ORDERS ||--o| SHIPMENTS : has
    ORDERS ||--o{ REFUNDS : has
    ORDERS ||--o{ DISPUTES : may_have
    USERS ||--o{ REVIEWS : writes
    PRODUCTS ||--o{ REVIEWS : receives
    SELLER_PROFILES ||--o{ PAYOUTS : receives
```
