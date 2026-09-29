# DastKar Hub — Internal Marketplace Discovery & Ranking Engine

## 1. Overview
The DastKar Hub Internal Marketplace Discovery and Ranking Engine is a dedicated backend domain capability designed to help buyers discover authentic, high-quality Pakistani handmade goods while giving newly verified artisan makers controlled initial visibility.

This system is completely decoupled from external search engine optimization (Google SEO). It powers internal discovery surfaces across DastKar Hub, including:
- Keyword search results (`/api/v1/products?q=...`)
- Category product listings (`/api/v1/products?category=...`)
- Trending crafts (`/api/v1/discovery/trending`)
- New arrivals (`/api/v1/discovery/new-arrivals`)
- Best sellers (`/api/v1/discovery/best-sellers`)
- Personalized / contextual recommendations (`/api/v1/discovery/recommended`)
- Artisan studio discovery (`/api/v1/discovery/new-makers`, `/api/v1/makers`)

---

## 2. Core Architecture
The ranking engine is implemented in the Laravel modular monolith backend under `app/Services/Discovery/`:
- **`ProductRankingService`**: Calculates multi-factor scores, balances relevance, quality, Bayesian reviews, engagement, conversion, seller trust, freshness, and applies seller diversity constraints.
- **`NewSellerBoostService`**: Manages qualification rules, time-decay factors, and expiration for newly onboarded artisans.
- **`MakerRankingService`**: Scores artisan guilds and identifies qualifying new makers for dedicated storefront spotlights.
- **`DiscoveryEventService`**: Ingests impression, click, and conversion events with anti-abuse and self-click protection.

---

## 3. Composite Ranking Formula
For each candidate product, the composite discovery score is evaluated as follows:

$$\text{Composite Score} = \left( \sum_{i} (W_i \times S_i) + \text{Effective New Seller Boost} \right) \times \text{Availability Multiplier}$$

### Signal Weights ($W_i$):
| Signal ($S_i$) | Default Weight | Description |
| :--- | :--- | :--- |
| **Relevance** | `0.30` | Term frequency coverage across title, category, description, materials, and artisan location. |
| **Reviews** | `0.15` | Bayesian-smoothed satisfaction score ($m=3, C=4.5$). |
| **Product Quality** | `0.10` | Completeness of imagery (1–4 images), description depth, materials, dimensions, variants, and care guide. |
| **Engagement** | `0.10` | Log-normalized user interactions (clicks, wishlist additions). |
| **Conversion** | `0.10` | Laplace-smoothed purchase rate over verified impressions. |
| **Seller Trust** | `0.10` | Verification tier (`established`, `verified`, `basic`), on-time delivery rate, and low cancellation rate. |
| **Freshness** | `0.05` | Linear decay factor over a 30-day window from publication. |
| **Availability** | `0.10` | In-stock items receive `1.0`. Out-of-stock items receive `0.10` (drastic down-ranking). |

---

## 4. Seller Diversity Enforcement
To prevent a single prolific guild from monopolizing the first page of search or category results, the engine enforces a configurable seller diversity constraint (`DISCOVERY_MAX_PRODUCTS_PER_SELLER`, default: 3):
1. Candidate products are sorted by composite score.
2. An accumulator selects up to $N$ products per maker.
3. Subsequent products from the same seller are deferred behind products from alternative makers, ensuring a rich variety of artisan representation.

---

## 5. Cold-Start Handling
New products and sellers naturally lack order history and reviews. Rather than penalizing missing data:
- Prior expectations are set to neutral benchmarks (rating prior: 4.5/5.0 with low weight $m=3$).
- Engagement defaults to neutral `0.40`.
- Conversion defaults to neutral `0.40`.
- The New Seller Boost provides controlled initial exposure to jump-start empirical interaction signals.
