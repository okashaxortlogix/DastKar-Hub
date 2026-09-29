# DastKar Hub — Operations & Incident Response Runbook

## 1. Daily Operational Routines

1. **Maker Verification Queue:**
   * Review pending artisan applications: `GET /api/v1/admin/verifications?status=under_review`
   * Confirm Pakistani craft authenticity (Chiniot wood, Multan pottery, Hala Ajrak, Swat shawls).
   * Approve or reject with actionable feedback for the maker.
2. **Dispute Resolution:**
   * Review open customer complaints: `GET /api/v1/admin/disputes?status=opened`
   * Evaluate photographic evidence.
   * Authorize partial/full refund or replacement.
3. **Seller Payout Settlement:**
   * Review pending maker disbursements: `GET /api/v1/admin/payouts?status=pending`
   * Confirm delivered orders have passed the return window (3 days buffer).
   * Authorize batch payment via State Bank of Pakistan Raast instant settlement.

---

## 2. Incident Response Severity Matrix

| Severity | Definition | Target Resolution | Escalation Contact |
| :--- | :--- | :--- | :--- |
| **SEV-1 (Critical)** | Core checkout or payment gateway down; orders cannot be processed. | < 30 Minutes | Lead Architect & On-Call SRE |
| **SEV-2 (Major)** | Courier API down; shipments cannot be booked or tracked. | < 2 Hours | Logistics Integration Engineer |
| **SEV-3 (Minor)** | Minor UI cosmetic glitch or delayed email notification. | < 24 Hours | Product Engineering |

---

## 3. Emergency Contacts & Escalation
* **Ops Center Email:** ops@dastkarhub.pk
* **Security Hotline:** security@dastkarhub.pk
