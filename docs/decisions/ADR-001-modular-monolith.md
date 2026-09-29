# ADR-001 — Modular Monolith First

## Decision

Build DastKar as a modular Laravel monolith rather than microservices for MVP.

## Why

- faster development
- simpler deployment
- easier debugging
- lower infrastructure overhead
- transaction consistency
- small team

## Revisit when

- independent scaling requirements appear
- team ownership boundaries appear
- queue workloads become isolated
- search/media/AI workloads justify separate services
