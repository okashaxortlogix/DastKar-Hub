# DastKar Hub — Production Security Checklist & OWASP Hardening

## 1. Authentication & Session Defense
* [x] **Password Hashing:** Argon2id / Bcrypt via Laravel `Hash::make()` with high computational cost.
* [x] **Rate Limiting:** Auth endpoints throttled (`/api/v1/auth/login` max 6 attempts/min; `/register` max 10/min).
* [x] **Brute-Force Guard:** Automatic IP-level lockouts upon repetitive failed authentication attempts.
* [x] **Sanctum Token Isolation:** Session revocation upon logout via `tokens()->delete()`.

## 2. Authorization & IDOR Protections
* [x] **Multi-Tier RBAC:** Strict separation of `buyer`, `seller`, and `admin` roles.
* [x] **Order IDOR Protection:** Scoped query `Order::where('buyer_id', $user->id)` prevents cross-tenant leaks.
* [x] **Seller Isolation:** Sellers restricted to viewing and modifying only their own catalog items and payouts.
* [x] **Admin Route Hardening:** Verification reviews, disputes arbitration, and disbursements locked to `role === 'admin'`.

## 3. Data Integrity & Financial Accounting
* [x] **Authoritative Pricing:** Total calculations calculated strictly server-side; client prices discarded.
* [x] **Immutable Historical Snapshots:** `order_items` stores frozen JSON snapshots of product title, SKU, craft origin, and customization at time of purchase.
* [x] **Atomic Inventory:** Transactions guard against overselling or race conditions.
* [x] **Double-Entry Financial Ledger:** `seller_ledgers` records all balance changes as immutable credits and debits.

## 4. Payment & Webhook Security
* [x] **HMAC SHA-256 Signatures:** JazzCash / Easypaisa webhooks validate cryptographic checksums against integrity salt.
* [x] **Idempotency Protection:** Duplicate webhook triggers return idempotent responses without double charging or duplicate order status updates.
* [x] **PCI-DSS Compliance:** Raw credit card data never touches DastKar servers (tokenized via 3D-Secure payment gateway).

## 5. Network & HTTP Headers
* [x] `X-Frame-Options: SAMEORIGIN` (Clickjacking prevention).
* [x] `X-Content-Type-Options: nosniff` (MIME sniffing prevention).
* [x] `X-XSS-Protection: 1; mode=block` (Reflected XSS filter).
* [x] `Referrer-Policy: strict-origin-when-cross-origin`.
