# Marketplace Seed Data & Production Safety Runbook

## 1. Overview
DastKar Hub includes a comprehensive seeding suite (`DastKarMarketplaceSeeder`) designed to populate local, staging, and QA environments with authentic Pakistani craft identities, real categories, and realistic pricing.

---

## 2. Seeded Dataset Summary
| Entity | Count | Key Attributes |
| :--- | :--- | :--- |
| **Major Categories** | `19` | 16 craft domains (Pottery, Leather, Woodwork, Shawls, Jewelry, Embroidery, etc.). |
| **Subcategories** | `81` | Specific craft niches (Multani Blue Mugs, Peshawari Sandals, Chiniot Trays). |
| **Artisan Makers** | `50` | Realistic Pakistani studios across Multan, Chiniot, Hala, Peshawar, Swat, Lahore, Quetta, Karachi, Gilgit, Bahawalpur. |
| **Maker Verification** | `5 Established / 34 Verified / 11 New` | Realistic tier distribution testing discovery and ranking signals. |
| **Products** | `325+` | Realistic Pakistani pricing (PKR 800 – 15,000+), rich craft descriptions, dimensions, care guides. |
| **Product Images** | `960+` | Curated authentic craft photography with multiple angles per product. |
| **Product Variants** | `160+` | Sizing for footwear, apparel, and jewelry. |
| **Customization Options** | `250+` | Personalized name engravings, gift packaging wraps. |
| **Demo Orders** | `38` | Controlled order history marked `is_seeded = true`. |
| **Demo Reviews** | `38` | Realistic distribution (70% 5★, 20% 4★, 10% 3★), marked `is_seeded = true`. |

---

## 3. Production Safety & Flagging
To prevent demo data from contaminating production accounting, audits, and genuine customer reviews:
1. **Explicit `is_seeded = true` Flag**:
   - Stored on `orders`, `order_items`, `reviews`, `products`, and `seller_profiles`.
2. **Financial Aggregation Separation**:
   - `AdminController::stats` reports `real_gmv` and `demo_gmv` distinctly.
   - Seeded demo orders are excluded from actual payout disbursement batches.
3. **Repeatable Execution**:
   - The seeder uses slug-based checks to ensure idempotent updates rather than creating duplicate records on repeated execution.

---

## 4. Running & Resetting the Seeder

### Run Seeder in Development:
```bash
php artisan db:seed --class=DastKarMarketplaceSeeder
```

### Full Clean Reset & Migration:
```bash
php artisan migrate:fresh --seed
```

### Disable Demo Data:
To ensure no demo orders or reviews are displayed in production environments, queries filter `is_seeded = false` or the seeder is strictly confined to non-production environments via `App::environment('local', 'staging', 'testing')`.
