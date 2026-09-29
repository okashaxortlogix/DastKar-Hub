# New Seller Discovery Boost

## 1. Purpose
In a handmade marketplace, newly verified artisans lack historical sales, community reviews, and search engagement. Without controlled initial discovery, their listings remain buried, leading to artisan churn.

The **New Seller Boost** gives newly registered and verified Pakistani artisans an automatic **+20% discovery boost for their 1st complete month (30 days)**, ensuring their authentic handmade craft pieces are discovered by patrons while rewarding consistency and safeguarding established seller equity.

---

## 2. Eligibility Criteria
An artisan maker qualifies for the discovery boost only when **all** of the following requirements are satisfied:
1. **Account Active**: `seller_status == 'active'` (suspended or paused sellers are ineligible).
2. **Verification Threshold**: `verification_status` is in `['basic', 'verified', 'established']` (unverified or rejected sellers receive 0 boost).
3. **Live Catalog**: The seller must have at least one approved, published product live in the marketplace (`status == 'published'`).
4. **Time Window**: Current timestamp is within `new_seller_boost_ends_at` (1st complete month: 30 days from onboarding / registration).

---

## 3. Boost Model & Consistency Rules

### Key Parameters (`config/discovery.php`):
- `duration_days = 30` (1st complete month)
- `max_boost_score = 0.20` (+20% discovery score boost)
- `consistency.min_on_time_delivery_rate = 90.0%`
- `consistency.max_cancellation_rate = 5.0%`
- `consistency.require_in_stock_products = true`

### Consistency Condition ("Consistent Rehte Hain To Boosted Rehti Hai"):
- If the new maker maintains active in-stock listings, fulfills patron orders reliably on time (&ge;90%), and avoids order cancellations (&le;5%):
  $$\text{Boost Score} = \text{Max Boost Score} = 0.20 \quad (20\%)$$
  The artisan workshop and its products maintain the **full +20% exposure** throughout their first month!

### Inconsistency & Disappearance ("Warna Slowly Slowly Disappear Hoti Jaye"):
- If the artisan allows their stock to deplete to zero, suffers high order cancellations (>5%), or has late deliveries (<90%):
  $$\text{Fraction Remaining} = \max\left(0.0, 1.0 - \frac{\text{Elapsed Seconds}}{\text{Total 30-Day Seconds}}\right)$$
  $$\text{Boost Score} = \text{Max Boost Score} \times \text{Fraction Remaining} \times 0.50$$
- The profile's discovery boost undergoes decay and steadily vanishes towards 0.00, causing the workshop's listings to gradually disappear from promoted discovery spots.
- Once the seller replenishes stock and improves fulfillment, consistency is restored and the full boost resumes for the remainder of the 30-day launch window.

---

## 4. Account Creation Disclosure ("Start Mein Account Create Ke Waqt Batana"):
At the time of account creation / registration (`AuthPage.tsx` when `role === 'seller'`), new artisans are explicitly presented with the Launch Boost notice:
- **Badge**: `+20% Extra Exposure (1st Complete Month / 30 Days)`
- **Core Promise**: Automatic 20% discovery boost across search, categories, and "Meet New Makers".
- **Consistency Requirement**: Must keep at least 1 piece in stock, fulfill orders on time (&ge;90%), and keep cancellations under 5%.
- **Decay Warning**: Clear disclosure that inactivity or out-of-stock inventory results in progressive boost decay and loss of top ranking.
- **Urdu Translation**: Accessible Urdu explanation for regional artisans across Pakistan.

---

## 5. Artisan Command Center Integration
In the Seller Dashboard (`SellerDashboardPage.tsx`), new artisans can track:
- **Active Boost Status**: Live indication of +20% boost active vs decaying.
- **Launch Progress**: Day counter (`Day X of 30`).
- **Health Indicators**: In-stock catalog status, on-time delivery rate, and cancellation rate.

---

## 6. Relevance Protection (Critical Safeguard)
> **Rule**: A new seller boost must NEVER override a major search relevance mismatch.

When a buyer searches for a specific craft (e.g., *"blue pottery vase"*):
- If a new seller lists an irrelevant item (e.g., leather footwear), the raw boost is scaled by the low relevance factor:
  $$\text{Effective Boost} = \text{Raw Boost} \times \text{Relevance}$$
- As a result, irrelevant products never jump to the top of search listings simply because the artisan is new.

---

## 7. Fair Exposure Rotation
The engine limits any single new seller to a maximum of 3 products on the primary listing grid (`max_products_per_seller = 3`). Multiple eligible new makers rotate alongside established high performers, preserving buyer trust and product diversity.
