# Marketplace Ranking Signals Reference

This document details the individual signals computed by `App\Services\Discovery\ProductRankingService`.

## 1. Relevance ($S_{\text{rel}}$)
Evaluates term frequency and coverage against structured product attributes:
- Exact term match in Title: +0.40 boost
- Match in Category name: +0.25 boost
- Match in Description, Materials, Artisan Studio Name, City, or Craft Description.
- Normalizes to a range of `[0.05, 1.00]`. If browsing without search keyword, defaults to neutral `1.00`.

## 2. Product Quality ($S_{\text{qual}}$)
Measures the depth and completeness of artisan product listings:
- **Image Depth**: +0.075 per image up to 4 images (+0.30 max).
- **Description Depth**: +0.15 for >100 characters; +0.25 for >300 characters.
- **Materials & Dimensions**: +0.15 for materials; +0.10 for dimensions.
- **Care Instructions & Customization**: +0.10 for care guide; +0.10 for customization options or sizing variants.
- Range: `[0.10, 1.00]`.

## 3. Reviews & Ratings ($S_{\text{rev}}$)
Employs Bayesian smoothing to prevent products with 1 five-star review from automatically outranking products with dozens of verified reviews:
$$R_{\text{smoothed}} = \frac{(v \times R) + (m \times C)}{v + m}$$
- $v$: Rating count
- $R$: Average rating (1–5)
- $m$: Prior weight (default: 3)
- $C$: Prior mean rating (default: 4.5)
- Normalized to `[0.0, 1.0]` by dividing by 5.0.

## 4. Engagement ($S_{\text{eng}}$)
Tracks authentic buyer curiosity via clicks and wishlist additions:
$$\text{Engagement Score} = \min\left(1.0, \frac{\log(1 + \text{clicks} + 2.5 \times \text{wishlists})}{\log(1 + 500)}\right)$$
- Cold-start default: `0.40` if zero activity.

## 5. Conversion ($S_{\text{conv}}$)
Evaluates verified purchases relative to impressions:
$$\text{Conversion Score} = \min\left(1.0, \frac{\text{sales} + 1}{\max(10, \text{impressions} / 8 + 15)}\right)$$
- Cold-start default: `0.40`.

## 6. Seller Trust ($S_{\text{trust}}$)
Reflects verified guild standing and fulfillment reliability:
- Tier Base:
  - `established`: 1.00
  - `verified`: 0.85
  - `basic`: 0.65
  - `unverified`: 0.40
- On-time delivery factor: $\times (\text{on\_time\_rate} / 100 \times 0.15)$
- Cancellation rate penalty: $- (\text{cancellation\_rate} / 50)$

## 7. Freshness ($S_{\text{fresh}}$)
Linear decay over 30 days from publication date:
$$S_{\text{fresh}} = \max\left(0.0, 1.0 - \frac{\text{Days Since Publication}}{30}\right)$$

## 8. Availability Multiplier ($M_{\text{avail}}$)
- In stock: `1.00`
- Out of stock: `0.10` (drastic down-ranking multiplier applied to final composite score)
