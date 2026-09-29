# DastKar Hub — Project Documentation & Product Blueprint

DastKar Hub is a maker-first Pakistani marketplace for handmade, customized, and locally crafted products.

This repository is the starting documentation package for building the platform with:

- Frontend: React + TypeScript
- Backend: PHP Laravel
- Database: PostgreSQL (recommended) or MySQL 8+
- API: REST/JSON
- Cache/queues: Redis
- Object storage: S3-compatible storage
- Search: PostgreSQL initially; OpenSearch later if needed
- Payments: regulated Pakistani payment provider(s), including Raast-compatible rails where commercially/technically available
- Logistics: courier APIs/integrations
- Deployment: Docker + Linux + managed cloud infrastructure

## Product philosophy

DastKar is a commerce platform first, not an AI demo and not a social-network clone.

The product should feel:
- fast
- trustworthy
- practical
- visual
- mobile-first
- marketplace-native
- dense enough for serious shopping
- warm enough to celebrate makers
- restrained in animation
- free from excessive gradients, glassmorphism, neon AI visuals, or generic AI dashboards

Benchmark inspiration:
- Daraz-style marketplace information density, seller operations, search, filters, checkout and seller tooling.
- Alibaba-style storefronts, catalog management, seller analytics, order management and business tooling.
- DastKar should NOT copy their branding, layouts, assets, or visual identity.

## Repository map

- `docs/00-foundation/` — product vision, principles, glossary, assumptions
- `docs/01-product/` — PRD, personas, journeys, MVP scope, requirements
- `docs/02-design/` — UX, design system, responsive rules, accessibility
- `docs/03-architecture/` — system architecture and technical decisions
- `docs/04-database/` — ERD, schema, indexing, data rules
- `docs/05-api/` — API conventions and endpoint contracts
- `docs/06-security/` — security, privacy, fraud and permissions
- `docs/07-commerce/` — payments, orders, returns, logistics, seller policies
- `docs/08-ai/` — AI feature boundaries and future architecture
- `docs/09-phases/` — phase-by-phase implementation plan
- `docs/10-testing/` — QA and acceptance strategy
- `docs/11-devops/` — environments, deployment and observability
- `docs/12-growth/` — analytics, metrics and marketplace growth
- `docs/13-operations/` — seller/customer/admin operations
- `docs/14-project-management/` — backlog, definition of done, release checklist
- `research/` — benchmark and research notes
- `decisions/` — architecture/product decision records

## Important rule

Do not build everything in this repository at once.

Phase 1 should prove:
1. makers will join,
2. buyers will purchase,
3. sellers can fulfill,
4. customers trust the marketplace,
5. transactions can be reconciled,
6. unit economics are measurable.

Only then expand the product.
