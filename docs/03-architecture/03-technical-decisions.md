# Technical Decisions

## Decision: React + TypeScript

Reason:
- mature ecosystem
- component reuse
- strong typing
- good marketplace UI ecosystem

## Decision: Laravel

Reason:
- mature authentication/authorization ecosystem
- queues/jobs/events
- database tooling
- validation
- maintainability
- fast development

## Decision: PostgreSQL

Recommended default for relational marketplace data.

## Decision: Redis

Use for:
- queues
- caching
- rate limiting
- transient state

## Decision: REST API first

Simple, explicit, easy to debug and integrate.

GraphQL is not required for MVP.

## Decision: Object storage

Never store large product images directly in database blobs.

## Decision: Background processing

Use queues for:
- image processing
- email/SMS
- notifications
- search indexing
- reports
- AI jobs
- reconciliation

## Decision: Modular monolith first

Do NOT begin with microservices.

Laravel modular monolith + queues is the preferred MVP architecture.

Split services only when scale/team boundaries justify it.
