# DastKar Hub — Backend API (`services/api`)

This directory contains the core REST API backend for **DastKar Hub**, built with **PHP 8.2+** and **Laravel 12**.

---

## 1. Directory Structure & File Map

```text
services/api/
├── app/
│   ├── Http/
│   │   ├── Controllers/Api/v1/       # Thin API resource controllers
│   │   │   ├── AuthController.php    # User registration, token issuance, login & profile
│   │   │   ├── CategoryController.php# Hierarchical categories & child trees
│   │   │   ├── ProductController.php # Full-text search, multi-filters, & product details
│   │   │   ├── SellerController.php  # Public artisan maker directory & profiles
│   │   │   ├── OrderController.php   # Authoritative checkout quote, orders, reviews
│   │   │   ├── SellerDashboardController.php # Seller stats, products CRUD, fulfillment
│   │   │   └── AdminController.php   # Platform metrics (GMV), artisan verification, audit
│   │   └── Middleware/
│   │       └── SecurityHeaders.php   # Defensive response headers (OWASP best practice)
│   ├── Models/                       # Eloquent models with relations, casts & hidden fields
│   │   ├── User.php                  # User entity with Sanctum tokens and role checks
│   │   ├── SellerProfile.php         # Maker metadata, craft description, badges & ratings
│   │   ├── Category.php              # Craft discipline with children relations
│   │   ├── Product.php               # Product with pricing, variants & customization
│   │   ├── ProductImage.php          # Ordered gallery images
│   │   ├── ProductVariant.php        # Sizing, dimensions, style variants
│   │   ├── CustomizationOption.php   # Structured buyer customizations
│   │   ├── Address.php               # Shipping address models
│   │   ├── Order.php                 # Orders with currency, totals, & payment states
│   │   ├── OrderItem.php             # Historical snapshots preserving title, image, price
│   │   ├── Payment.php               # Payment records (COD, JazzCash, Cards, Bank)
│   │   ├── Review.php                # Verified buyer reviews & artisan responses
│   │   └── AuditLog.php              # Tamper-evident admin & seller audit logs
│   └── Services/
│       └── CheckoutService.php       # Transaction-safe authoritative pricing engine
├── database/
│   ├── migrations/                   # 12 relational database migrations
│   └── seeders/
│       └── DatabaseSeeder.php        # Realistic Pakistani craft seed data
├── routes/
│   ├── api.php                       # Versioned /api/v1 routes with rate limits
│   └── web.php                       # Basic web ping
├── tests/
│   └── Feature/
│       └── MarketplaceApiTest.php    # Automated feature test suite (80 assertions)
├── config/                           # Application configuration files (CORS, Sanctum, etc.)
└── composer.json                     # Backend PHP dependencies
```

---

## 2. API Endpoints Map (`/api/v1`)

### Public Catalog Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Register new buyer or maker account (Rate limited) |
| `POST` | `/api/v1/auth/login` | Authenticate and obtain Sanctum bearer token (Rate limited) |
| `GET` | `/api/v1/categories` | Retrieve hierarchical categories tree |
| `GET` | `/api/v1/categories/{slug}` | Retrieve category and associated crafts |
| `GET` | `/api/v1/products` | Filterable craft catalog (`q`, `category`, `min_price`, `material`, etc.) |
| `GET` | `/api/v1/products/featured`| Retrieve curated featured products |
| `GET` | `/api/v1/products/{slug}` | Full product details with seller, variants, & reviews |
| `GET` | `/api/v1/makers` | Directory of verified Pakistani artisans |
| `GET` | `/api/v1/makers/{slug}` | Artisan storefront profile & story |
| `POST` | `/api/v1/checkout/quote` | Authoritative server quote calculation |

### Authenticated Patron Endpoints (`auth:sanctum`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/auth/me` | Current user profile |
| `POST` | `/api/v1/auth/logout` | Revoke active bearer token |
| `POST` | `/api/v1/checkout/process` | Place order (Atomic stock deduction + snapshot) |
| `GET` | `/api/v1/orders` | Patron order history |
| `GET` | `/api/v1/orders/{orderNumber}` | Order details & courier tracking |
| `POST` | `/api/v1/orders/{orderNumber}/review` | Submit review for delivered product |
| `GET` | `/api/v1/addresses` | Saved customer delivery addresses |

### Authenticated Seller Hub (`auth:sanctum` + seller role)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/seller/stats` | Live sales, total orders, rating, & recent items |
| `GET` | `/api/v1/seller/products` | Manage seller's craft pieces |
| `POST` | `/api/v1/seller/products` | Publish new piece with variants & photos |
| `PUT` | `/api/v1/seller/products/{id}` | Update product pricing or stock |
| `DELETE` | `/api/v1/seller/products/{id}`| Remove piece from store |
| `GET` | `/api/v1/seller/orders` | Fulfillment queue |
| `PATCH` | `/api/v1/seller/orders/{id}/status` | Advance fulfillment status (`processing`, `shipped`, `delivered`) |

### Platform Operations (`auth:sanctum` + admin role)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/admin/stats` | Platform GMV, orders count, seller/buyer statistics |
| `POST` | `/api/v1/admin/sellers/{id}/verify` | Assign `verified` or `established` badge |
| `GET` | `/api/v1/admin/audit-logs` | Review tamper-evident administrative audit trail |

---

## 3. Running Backend Tests

Run all automated feature tests:
```bash
php artisan test --filter=MarketplaceApiTest
```
