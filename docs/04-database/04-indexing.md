# Database Indexing Plan

## High-priority indexes

users:
- email
- phone
- status

seller_profiles:
- slug
- verification_status
- seller_status

products:
- seller_id
- category_id
- status
- published_at
- slug

product_variants:
- product_id
- sku

orders:
- order_number
- buyer_id
- status
- created_at

order_items:
- order_id
- seller_id
- product_id

payments:
- order_id
- provider_reference
- status

shipments:
- order_id
- tracking_number

reviews:
- product_id
- seller_id
- status

disputes:
- order_id
- status

## Rule

Do not add indexes blindly. Review query plans after real traffic appears.
