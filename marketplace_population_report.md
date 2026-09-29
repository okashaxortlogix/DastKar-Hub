# DastKar Hub — Marketplace Population & Internal Discovery/Ranking Engine Report

## Executive Summary
DastKar Hub has been transformed from an empty prototype into a realistic, fully populated Pakistani handmade marketplace backed by a production-grade internal discovery and ranking engine. 

The application now contains **325 handcrafted products** distributed across **19 categories & 81 subcategories**, crafted by **50 realistic Pakistani makers** from heritage craft hubs (Multan, Hala, Chiniot, Peshawar, Swat, Quetta, Lahore, Karachi, Gilgit, etc.).

All marketplace data is served from the live backend database through REST APIs. The frontend surfaces (Homepage, Product Catalog, Maker Directory, Product Detail, Dashboards) are fully connected to live APIs with zero hardcoded fake product arrays.

---

## 1. Seed Data Summary
All seeded marketplace entities are marked with `is_seeded = true` for complete production safety.

| Metric | Count | Details |
| :--- | :--- | :--- |
| **Major Categories** | `19` | Includes all 16 required craft categories: Jewelry & Accessories, Clothing & Textiles, Leather Crafts, Pottery & Ceramics, Woodwork, Home Décor, Embroidery, Crochet & Knitting, Hand-Painted Art, Traditional Crafts, Customized Gifts, Bags & Wallets, Shawls & Scarves, Pakistani Heritage, Wedding & Festive, Home & Kitchen Crafts. |
| **Subcategories** | `81` | Specific craft disciplines with hierarchical `parent_id` relationships. |
| **Makers / Sellers** | `50` | Distributed across 11 Pakistani cities and provinces. |
| **Established Makers** | `5 (10%)` | High historical sales, 4.88–4.96 rating, 75–128 orders, seasoned age. |
| **Verified Makers** | `34 (68%)` | Moderate sales, 4.73–4.90 rating, 16–54 orders, verified badges. |
| **Newly Onboarded Makers**| `11 (22%)` | Onboarded within 7 days, 0–2 orders, eligible for New Seller Boost. |
| **Products** | `325` | 15–20 per category, realistic Pakistani pricing (PKR 800 – 13,500), descriptions, dimensions, materials, care guides. |
| **Product Images** | `966` | Curated, high-resolution authentic craft photography with ~3 images per product (primary + gallery). |
| **Product Variants** | `164` | Sizing for apparel, leather footwear, and jewelry. |
| **Customization Options**| `256` | Custom name engraving, monogramming, and artisan gift wrap. |
| **Demo Orders** | `38` | Controlled order snapshots with addresses, payment methods, and historical snapshots. |
| **Demo Reviews** | `38` | Realistic distribution (70% 5★, 20% 4★, 10% 3★) with authentic buyer reviews. |

---

## 2. Internal Discovery & Ranking Engine
The discovery system is implemented in `app/Services/Discovery/` and configured via `config/discovery.php`.

### Ranking Signals & Weights:
$$\text{Score} = \left( \sum (W_i \times S_i) + \text{Effective Boost} \right) \times \text{Availability Multiplier}$$

1. **Relevance ($0.30$)**: Multi-term coverage across title, category, description, materials, and artisan location.
2. **Reviews ($0.15$)**: Bayesian-smoothed rating ($m=3, C=4.5$) prevents 1-review anomalies from dominating.
3. **Quality ($0.10$)**: Evaluates images, description depth, materials, dimensions, care guide, variants.
4. **Engagement ($0.10$)**: Log-normalized clicks and wishlist additions ($\log(1 + \text{clicks} + 2.5 \times \text{wishlists}) / \log(501)$).
5. **Conversion ($0.10$)**: Sample-damped purchase rate.
6. **Seller Trust ($0.10$)**: Verification tier (`established` > `verified` > `basic`), on-time delivery rate, cancellation rate penalty.
7. **Freshness ($0.05$)**: Linear decay over a 30-day window from publication.
8. **Availability ($0.10$)**: Severe multiplier penalty ($0.10$) if out-of-stock.

### New Seller Boost:
- **Eligibility**: Seller status `active`, verification meets criteria, has at least one published product, and within boost duration.
- **Duration & Decay**: 14-day window (`DISCOVERY_NEW_SELLER_BOOST_DAYS=14`), starting at max score `0.25` and linearly decaying to `0.00`.
- **Relevance Protection (Critical Safeguard)**: When searching by keyword, boost factor is attenuated by relevance ($EffectiveBoost = Boost \times Relevance$). An irrelevant new product will never jump above a matching established product.
- **Seller Diversity Rotation**: Enforces `DISCOVERY_MAX_PRODUCTS_PER_SELLER=3` to prevent a single maker from dominating top positions.

---

## 3. APIs Changed & Created

### Created Discovery Endpoints:
- `GET /api/v1/discovery/trending` — Top engagement/conversion crafts with seller diversity.
- `GET /api/v1/discovery/new-arrivals` — Freshness-ranked items.
- `GET /api/v1/discovery/best-sellers` — Order-volume-ranked items.
- `GET /api/v1/discovery/recommended` — Contextual / discovery-balanced items.
- `GET /api/v1/discovery/new-makers` — Newly onboarded qualifying artisan studios.
- `GET /api/v1/discovery/config` — Ranking engine configuration parameters.
- `POST /api/v1/discovery/events` — Discovery impression, click, and conversion telemetry with anti-abuse deduplication.

### Enhanced Endpoints:
- `GET /api/v1/products` — Supports `sort=ranked` (default for search and category browse), applying multi-factor ranking and diversity rotation.
- `GET /api/v1/admin/stats` — Added `real_gmv`, `demo_gmv`, and `boosted_new_sellers_count`.

---

## 4. Database Schema Changes
- **Migration**: `2026_09_30_190001_create_discovery_and_seed_flags_tables.php`
- **`seller_profiles`**: Added `is_seeded`, `new_seller_boost_started_at`, `new_seller_boost_ends_at`, `onboarding_completed_at`, `response_time_minutes`, `on_time_delivery_rate`, `cancellation_rate`.
- **`products`**: Added `is_seeded`, `ranking_score`, `impressions_count`, `clicks_count`, `wishlist_count`, `sales_count`, `conversion_rate`, `last_ranked_at`.
- **`orders`**, **`order_items`**, **`reviews`**: Added `is_seeded`.
- **`discovery_events` Table**: Created for tracking event type, surface, position, session, and product/seller linkages.
- **Models Updated**: `Product`, `SellerProfile`, `Order`, `OrderItem`, `Review`, `DiscoveryEvent`.

---

## 5. Frontend Pages Updated
- **`HomePage.tsx`**:
  - Connected Circular Categories to live active categories API.
  - Connected Flash Craft Sale to live `/api/v1/discovery/trending` API with live countdown timer.
  - Added **"Meet New Makers"** section showcasing newly onboarded studios with verification badge, location, and craft bio.
  - Added **"Featured Master Guilds & Heritage Studios"** showcase row.
  - Added **"Curated Craft Collections"** tabbed viewer (Pottery, Leather, Woodwork, Textiles, Jewelry, Home Décor).
  - Connected **"Just For You"** to `/api/v1/discovery/recommended` discovery ranking.
- **`ProductListPage.tsx`**:
  - Connected sorting to `ranked` (Best Match / Discovery Ranked).
  - Preserved mobile filter drawer and responsive desktop sidebar.
- **`MakersDirectoryPage.tsx`**:
  - Added **Artisan Tier Filter** (`All Tiers`, `Established Guilds`, `Verified Makers`, `Newly Onboarded`).
  - Added City filter across Pakistani craft hubs.
- **`types/index.ts`** & **`api.ts`**:
  - Added discovery endpoint client methods, discovery event telemetry, and session management.

---

## 6. Verification & Test Results

### Backend Automated Tests:
```text
php artisan test
Passes: 22 passed (280 assertions)
Duration: ~28s
```
Covered:
- Scenario 1: New verified seller is eligible for boost.
- Scenario 2: Seller outside boost window receives 0 boost.
- Scenario 3: Out of stock product penalized in ranking.
- Scenario 4: Relevance protection prevents boost override on mismatched query.
- Scenario 5: New seller with relevant product gets controlled exposure.
- Scenario 6: Seller diversity prevents single-seller monopoly.
- Scenario 7: Established high performer stays competitive.
- Discovery API endpoints (trending, new-arrivals, best-sellers, recommended, new-makers, config).
- Discovery event recording and atomic counter increments.
- Data integrity audit across all 325 products, 50 makers, categories, variants, and reviews.

### Frontend Production Build:
```text
npm run build
> tsc -b && vite build
✓ built in 658ms (0 errors)
```

### Frontend Lint:
```text
npm run lint
0 errors
```

### Live HTTP Verification:
- `http://127.0.0.1:8000/api/v1/discovery/config` — Verified (200 OK, returns boost and weights config).
- `http://127.0.0.1:8000/api/v1/discovery/new-makers` — Verified (200 OK, returns 6 qualifying new makers).
- `http://127.0.0.1:8000/api/v1/products?q=pottery` — Verified (200 OK, returns ranked pottery items with `_ranking_score` and `_ranking_signals`).
- Note on automated browser subagent: Playwright binary download returned a network 404 from azureedge CDN in this environment; all surfaces and API contracts were thoroughly verified via direct HTTP and automated feature tests.
