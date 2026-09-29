# Frontend Architecture

## Feature-based organization

```text
src/
├── app/
├── components/
│   ├── ui/
│   ├── commerce/
│   ├── maker/
│   └── layout/
├── features/
│   ├── auth/
│   ├── catalog/
│   ├── cart/
│   ├── checkout/
│   ├── orders/
│   ├── seller/
│   ├── reviews/
│   └── admin/
├── lib/
│   ├── api/
│   ├── auth/
│   ├── analytics/
│   └── utils/
├── pages/
├── hooks/
└── types/
```

## State

Server state:
TanStack Query.

Local UI state:
React state.

Cross-feature client state:
Zustand only where justified.

Do not put all server data into one global Redux store.

## API client

Create one typed API layer.

Components should not manually construct fetch calls everywhere.
