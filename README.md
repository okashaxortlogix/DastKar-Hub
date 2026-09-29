# DastKar Hub — The Digital Home for Pakistan's Independent Makers

**DastKar Hub** is a maker-first marketplace connecting authentic Pakistani artisans (potters, woodcarvers, textile weavers, leatherworkers, and jewelry smiths) with patrons seeking genuine, customizable, and trustworthy handcrafted treasures.

---

## 1. Project Directory Hierarchy

The repository is organized as a clean, modular monorepo:

```text
dastkar-hub/
├── apps/
│   └── web/                                  # Frontend Single Page Application (SPA)
│       ├── public/                           # Static assets, favicon, SVGs
│       ├── src/
│       │   ├── components/                   # Reusable UI & commerce building blocks
│       │   │   ├── commerce/                 # ProductCard, TrustBadge, etc.
│       │   │   └── layout/                   # Navbar (trust bar, search), Footer
│       │   ├── lib/                          # Core frontend libraries & state
│       │   │   ├── api.ts                    # Central typed REST API client
│       │   │   ├── authContext.tsx           # Authentication & session provider
│       │   │   └── cartContext.tsx           # Shopping cart & local storage state
│       │   ├── pages/                        # Route page views
│       │   │   ├── HomePage.tsx              # Marketplace landing with hero & categories
│       │   │   ├── ProductListPage.tsx       # Filterable catalog with search & price sliders
│       │   │   ├── ProductDetailPage.tsx     # Gallery, variants, customization, & reviews
│       │   │   ├── CartPage.tsx              # Cart review, quantity adjuster, & subtotal
│       │   │   ├── CheckoutPage.tsx          # Multi-step checkout (COD, JazzCash, Cards)
│       │   │   ├── MakersDirectoryPage.tsx   # Artisan guild directory
│       │   │   ├── MakerProfilePage.tsx      # Artisan storefront & craft heritage story
│       │   │   ├── CustomerDashboardPage.tsx # Buyer orders, tracking & reviews
│       │   │   ├── SellerDashboardPage.tsx   # Mobile-first artisan command center
│       │   │   ├── AdminDashboardPage.tsx    # Platform governance & maker vetting queue
│       │   │   └── AuthPage.tsx              # Unified Patron / Maker login & register
│       │   ├── types/                        # Strongly typed TypeScript domain definitions
│       │   │   └── index.ts                  # User, Product, Seller, Order, Review schemas
│       │   ├── App.tsx                       # Main router layout & context wiring
│       │   ├── index.css                     # Tailwind CSS v4 design tokens & base resets
│       │   └── main.tsx                      # React root entrypoint
│       ├── package.json                      # Frontend dependencies (React 19, Lucide, Router)
│       ├── tsconfig.json                     # TypeScript compiler configuration
│       └── vite.config.ts                    # Vite 8 config with Tailwind v4 & API proxy
│
├── services/
│   └── api/                                  # Backend REST API (Laravel 12 Modular Monolith)
│       ├── app/
│       │   ├── Http/
│       │   │   ├── Controllers/Api/v1/       # REST API resource controllers
│       │   │   │   ├── AuthController.php    # Register, login, token issue, profile
│       │   │   │   ├── CategoryController.php# Categories tree with subcategories
│       │   │   │   ├── ProductController.php # Search, catalog filters, related products
│       │   │   │   ├── SellerController.php  # Public maker directory and profiles
│       │   │   │   ├── OrderController.php   # Quote, checkout, orders, reviews, addresses
│       │   │   │   ├── SellerDashboardController.php # Seller stats, products, fulfillment
│       │   │   │   └── AdminController.php   # GMV, verification queue, audit logs
│       │   │   └── Middleware/
│       │   │       └── SecurityHeaders.php   # Defensive headers (nosniff, SAMEORIGIN, etc.)
│       │   ├── Models/                       # Eloquent models with relations & casts
│       │   │   ├── User.php                  # User entity with Sanctum tokens
│       │   │   ├── SellerProfile.php         # Artisan profile, craft details, badges
│       │   │   ├── Category.php              # Hierarchical craft disciplines
│       │   │   ├── Product.php               # Product model with stock and pricing
│       │   │   ├── ProductImage.php          # Ordered gallery images
│       │   │   ├── ProductVariant.php        # Sizes, styles, dimensions
│       │   │   ├── CustomizationOption.php   # Inscription / personalization options
│       │   │   ├── Address.php               # Customer shipping addresses in Pakistan
│       │   │   ├── Order.php                 # Orders with transactional status
│       │   │   ├── OrderItem.php             # Historical snapshots preserving price/title
│       │   │   ├── Payment.php               # Payment records (COD, JazzCash, Card)
│       │   │   ├── Review.php                # Verified buyer feedback & ratings
│       │   │   └── AuditLog.php              # Tamper-evident admin & seller audit trail
│       │   └── Services/
│       │       └── CheckoutService.php       # Transactional authoritative pricing engine
│       ├── database/
│       │   ├── migrations/                   # 12 relational database migrations
│       │   └── seeders/                      # Realistic Pakistani artisan craft data
│       ├── routes/
│       │   └── api.php                       # Versioned /api/v1 endpoints with throttling
│       ├── tests/
│       │   └── Feature/                      # Automated API integration test suite
│       │       └── MarketplaceApiTest.php    # Auth, catalog, checkout, & snapshot tests
│       └── composer.json                     # Backend PHP dependencies (Laravel 12, Sanctum)
│
├── docs/                                     # Comprehensive Architecture & Product Specs
│   ├── 00-foundation/                        # Vision, principles, glossary
│   ├── 01-product/                           # PRD, personas, customer journeys
│   ├── 02-design/                            # UI/UX, responsive rules, color tokens
│   ├── 03-architecture/                      # Monolith design, repo structure
│   ├── 04-database/                          # Relational ERD, schema, data rules
│   ├── 05-api/                               # API contracts, convention, payload formats
│   ├── 06-security/                          # Threat modeling, RBAC, fraud detection
│   ├── 07-commerce/                          # Pricing engine, logistics, payouts
│   ├── 08-ai/                                # Future AI boundary specifications
│   ├── 09-phases/                            # Milestone roadmap (Milestones 1–5)
│   ├── 10-testing/                           # QA plan & acceptance criteria
│   ├── 11-devops/                            # Environments, CI/CD, and monitoring
│   ├── 12-growth/                            # Marketplace flywheel & metrics
│   ├── 13-operations/                        # Support, dispute resolution, refund policy
│   ├── 14-project-management/                # Definition of Done, delivery checklist
│   ├── decisions/                            # Architecture Decision Records (ADRs)
│   └── research/                             # Benchmark notes against Daraz/Alibaba
│
├── infra/                                    # Deployment & Container Infrastructure
├── packages/                                 # Shared packages & schema contracts
├── scripts/                                  # Automation & maintenance scripts
└── .gitignore                                # Root git ignore rules
```

---

## 2. Technology Stack

- **Frontend:** React 19, TypeScript 5.8, Vite 8, Tailwind CSS v4, Lucide React, React Router v7.
- **Backend:** PHP 8.2+, Laravel 12, Laravel Sanctum (token-based auth), REST API (`/api/v1`).
- **Database:** SQLite (for local development/testing) and PostgreSQL/MySQL (production ready).
- **Architecture:** Modular Monolith with dedicated Domain Services (`CheckoutService`).

---

## 3. How to Run Locally

### Prerequisites
- Node.js 18+ & npm
- PHP 8.2+ with `pdo_sqlite` (or `pdo_mysql`), `curl`, `mbstring`, `openssl`
- Composer 2.x

### Step 1: Backend Setup
```bash
cd services/api

# Install dependencies (if not already installed)
composer install

# Set environment
cp .env.example .env
php artisan key:generate

# Run migrations and seed Pakistani craft data
php artisan migrate:fresh --seed

# Start API server on port 8000
php artisan serve --port=8000
```
API will run at `http://127.0.0.1:8000`.

### Step 2: Frontend Setup
In a new terminal:
```bash
cd apps/web

# Install dependencies
npm install

# Start Vite dev server (proxies /api to localhost:8000)
npm run dev
```
Open `http://localhost:5173/` in your browser.

---

## 4. Test User Accounts (Pre-Seeded)

| Role | Name | Email | Password | Access / Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Patron / Buyer** | Ayesha Siddiqui | `ayesha.buyer@dastkarhub.pk` | `password123` | Order crafts, track deliveries, submit reviews |
| **Artisan / Maker** | Ustad Fayyaz (Multan) | `fayyaz.kashigar@dastkarhub.pk` | `password123` | Access Seller Command Center, manage products, fulfill orders |
| **Platform Admin** | Platform Operator | `admin@dastkarhub.pk` | `password123` | Review verification queue, platform GMV, audit logs |

*(One-click demo login buttons are also available on the `/auth` page for instant testing).*

---

## 5. Automated Testing & Quality Assurance

To execute backend feature and integration tests:
```bash
cd services/api
php artisan test
```
All feature tests (`MarketplaceApiTest.php`) validate:
- Categories tree endpoint
- Product search & filtering
- Authoritative backend checkout quotes
- User registration and login token issuance
- End-to-end checkout with atomic inventory reduction & historical snapshot preservation

To test frontend production build:
```bash
cd apps/web
npm run build
```

---

## 6. Cybersecurity Architecture & Defense Posture

DastKar Hub incorporates defensive security at every tier:
1. **Broken Access Control (IDOR) Defense:** All seller actions are strictly scoped to `$request->user()->sellerProfile->id`. Buyers cannot view or manipulate other users' orders.
2. **Authoritative Pricing Engine:** Product prices, variant pricing, customization deltas, and shipping rules are calculated exclusively on the backend inside a database transaction (`DB::transaction`). Client-side price tampering is impossible.
3. **Stored XSS Prevention:** Text inputs for products, addresses, and customer reviews are sanitized with `htmlspecialchars(strip_tags(...), ENT_QUOTES, 'UTF-8')`.
4. **Brute Force Protection:** Authentication endpoints are rate-limited via Laravel route throttling (`throttle:6,1` on login; `throttle:10,1` on registration).
5. **Review Spam Defense:** Only buyers who completed an order containing that product can leave a review, and duplicate submissions for the same item are blocked.
6. **Defensive Response Headers:** `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `X-XSS-Protection: 1; mode=block`, and strict referrer policies are attached to all responses via `SecurityHeaders` middleware.
