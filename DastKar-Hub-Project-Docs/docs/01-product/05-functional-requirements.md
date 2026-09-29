# Functional Requirements

## FR-001 Authentication
Users must be able to create and securely access accounts.

## FR-002 Role control
System supports buyer, seller, admin and operations roles.

## FR-003 Seller verification
Seller cannot become marketplace-active until required verification state is approved.

## FR-004 Product lifecycle
Product states: draft, pending_review, published, paused, rejected, archived.

## FR-005 Order lifecycle
Order state transitions must be explicit and validated server-side.

## FR-006 Payment
Payment status must be independent from order status.

## FR-007 Inventory
Inventory updates must be atomic for checkout/stock reservation.

## FR-008 Customization
Customization data is stored with order line items and is immutable after production begins except through an explicit change workflow.

## FR-009 Reviews
Only eligible completed purchases may create reviews.

## FR-010 Disputes
Every dispute has a reason, evidence, status, actor history and resolution.

## FR-011 Notifications
Users receive notifications for relevant state changes.

## FR-012 Audit
Sensitive admin and financial actions are logged.

## FR-013 Search
Search supports product name, category, maker and selected attributes.

## FR-014 Moderation
Admins can restrict products/sellers.

## FR-015 Reporting
Operational dashboards expose orders, GMV, sellers, buyers, disputes and fulfillment metrics.
