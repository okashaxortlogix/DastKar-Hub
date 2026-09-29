# System Architecture

## High-level

React SPA / SSR-capable frontend
        |
        | HTTPS REST/JSON
        v
Laravel API
        |
        +-- PostgreSQL
        +-- Redis
        +-- Object Storage
        +-- Queue Workers
        +-- Search
        +-- Payment Provider
        +-- Courier APIs
        +-- Notification Providers

## Frontend

Recommended:
- React
- TypeScript
- Vite for SPA or Next.js if SEO/SSR requirements justify it
- React Router if using Vite SPA
- TanStack Query for server state
- Zustand or Redux Toolkit only where global client state genuinely needs it
- Tailwind CSS or CSS Modules
- React Hook Form + Zod for forms/validation

## Backend

Laravel:
- REST API
- Form Requests
- Policies/Gates
- Service layer for complex domain operations
- Jobs/Queues
- Events/Listeners
- Notifications
- API Resources
- database transactions

## Database

PostgreSQL recommended because of:
- strong relational capabilities
- JSONB where useful
- indexing
- full-text search
- mature transactional behavior

MySQL 8+ is also viable.

## Cache/queues

Redis:
- caching
- rate limiting
- queues
- short-lived state

## Storage

S3-compatible object storage:
- product images
- seller documents
- review media
- generated assets

Private seller documents must not be public.

## Search

Start:
PostgreSQL full-text/search indexes.

Later:
OpenSearch/Elasticsearch if catalog scale and relevance requirements justify it.

## Architecture principle

Keep business logic in Laravel/domain services, not duplicated across React components.
