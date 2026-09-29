# Database Schema Blueprint

## users
- id
- role
- name
- email
- phone
- password_hash
- status
- email_verified_at
- phone_verified_at
- last_login_at
- timestamps

## seller_profiles
- id
- user_id
- display_name
- slug
- bio
- craft_description
- location_city
- location_region
- verification_status
- seller_status
- rating_average
- rating_count
- timestamps

## verifications
- id
- seller_id
- type
- status
- submitted_at
- reviewed_at
- reviewer_id
- rejection_reason
- metadata_json

## storefronts
- id
- seller_id
- logo_path
- cover_path
- story
- settings_json

## categories
- id
- parent_id
- name
- slug
- status
- sort_order

## products
- id
- seller_id
- category_id
- title
- slug
- description
- base_price
- status
- production_days
- return_policy_id
- weight_grams
- length_mm
- width_mm
- height_mm
- published_at
- timestamps

## product_variants
- id
- product_id
- sku
- name
- price
- stock_quantity
- reserved_quantity
- attributes_json

## product_images
- id
- product_id
- path
- alt_text
- sort_order
- media_type

## customization_options
- id
- product_id
- name
- type
- required
- configuration_json

## carts
- id
- user_id
- status

## cart_items
- id
- cart_id
- product_id
- variant_id
- quantity
- customization_json

## orders
- id
- order_number
- buyer_id
- status
- subtotal
- shipping_fee
- discount_amount
- tax_amount
- total_amount
- currency
- shipping_address_snapshot
- placed_at
- delivered_at

## order_items
- id
- order_id
- seller_id
- product_id
- variant_id
- product_snapshot_json
- customization_json
- quantity
- unit_price
- subtotal
- status

## payments
- id
- order_id
- provider
- provider_reference
- status
- amount
- paid_at
- metadata_json

## shipments
- id
- order_id
- courier
- tracking_number
- status
- shipped_at
- delivered_at
- metadata_json

## payouts
- id
- seller_id
- order_id
- gross_amount
- commission_amount
- adjustments
- net_amount
- status
- scheduled_at
- paid_at

## reviews
- id
- order_id
- order_item_id
- buyer_id
- product_id
- seller_id
- rating
- body
- status
- seller_response
- timestamps

## disputes
- id
- order_id
- opened_by
- reason
- status
- resolution
- resolution_amount
- timestamps

## audit_logs
- id
- actor_id
- action
- entity_type
- entity_id
- before_json
- after_json
- ip_address
- user_agent
- created_at
