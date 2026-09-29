# Recommended Repository Structure

Option A: monorepo

```text
dastkar/
├── apps/
│   ├── web/
│   │   ├── src/
│   │   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── features/
│   │   │   ├── pages/
│   │   │   ├── hooks/
│   │   │   ├── lib/
│   │   │   ├── types/
│   │   │   └── styles/
│   │   └── tests/
│   └── admin/
├── services/
│   └── api/
│       ├── app/
│       ├── database/
│       ├── routes/
│       ├── tests/
│       └── storage/
├── packages/
│   └── contracts/
├── docs/
├── infra/
│   ├── docker/
│   ├── nginx/
│   └── terraform/
└── scripts/
```

If a separate admin frontend is unnecessary initially, keep admin routes within the main React application with strict role-based access.

## Backend Laravel structure

```text
app/
├── Actions/
├── Console/
├── Events/
├── Exceptions/
├── Http/
│   ├── Controllers/
│   ├── Middleware/
│   ├── Requests/
│   └── Resources/
├── Jobs/
├── Models/
├── Notifications/
├── Policies/
├── Services/
└── Support/
```

Keep controllers thin.
