# DastKar Hub — Frontend Web Client (`apps/web`)

This directory contains the single-page application for **DastKar Hub**, built with **React 19**, **TypeScript**, **Vite 8**, and **Tailwind CSS v4**.

---

## 1. Directory Structure & File Map

```text
apps/web/
├── public/                     # Static browser assets (favicon, SVG icons)
├── src/
│   ├── components/             # Reusable UI & commerce building blocks
│   │   ├── commerce/
│   │   │   └── ProductCard.tsx # Craft card with image, artisan badge, pricing & quick-add
│   │   └── layout/
│   │       ├── Navbar.tsx      # Sticky header, trust bar, search, category ribbon & cart badge
│   │       └── Footer.tsx      # Comprehensive artisan footer with regional craft links
│   ├── lib/                    # Services, API clients, and React Context state
│   │   ├── api.ts              # Typed API client interfacing with Laravel REST endpoints
│   │   ├── authContext.tsx     # Session management, Sanctum bearer token, role helpers
│   │   └── cartContext.tsx     # Cart items state with localStorage persistence & totals
│   ├── pages/                  # Page-level components mapped to route URLs
│   │   ├── HomePage.tsx        # Hero banner, category pills, featured craft products
│   │   ├── ProductListPage.tsx # Multi-filter catalog (price, rating, materials) & sort
│   │   ├── ProductDetailPage.tsx # Image gallery, variants, customization, & reviews
│   │   ├── CartPage.tsx        # Craft bag review, quantity controls, subtotal calculation
│   │   ├── CheckoutPage.tsx    # 3-step checkout (address, delivery, payment method)
│   │   ├── MakersDirectoryPage.tsx # Directory of all Pakistani artisan workshops
│   │   ├── MakerProfilePage.tsx # Individual artisan storefront & craft heritage story
│   │   ├── CustomerDashboardPage.tsx # Patron order history, tracking & review submission
│   │   ├── SellerDashboardPage.tsx # Mobile-first artisan command center & order fulfillment
│   │   ├── AdminDashboardPage.tsx # Platform operations, GMV metrics & artisan vetting queue
│   │   └── AuthPage.tsx        # Sign In & Registration (Buyer/Maker) with 1-click test logins
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces for User, Product, Order, etc.
│   ├── App.tsx                 # Main application layout, React Router routes, & Providers
│   ├── index.css               # Tailwind CSS v4 setup, artisan palette, & scrollbars
│   └── main.tsx                # Application mounting entry point
├── package.json                # Dependencies: react, react-router-dom, lucide-react, tailwindcss
├── tsconfig.json               # TypeScript configuration
└── vite.config.ts              # Vite configuration with Tailwind v4 plugin & `/api` proxy
```

---

## 2. Key Architectural Decisions

1. **API Proxying:** In development, Vite proxies `/api/*` to `http://127.0.0.1:8000`, eliminating Cross-Origin Resource Sharing (CORS) issues during development.
2. **Authoritative Pricing:** The frontend never determines the price. Quotes and final order calculations are fetched from the backend `/checkout/quote` and `/checkout/process` endpoints.
3. **Responsive Mobile-First Design:** The application conforms fluidly across breakpoints (Mobile: 2-column product grid; Desktop: 3-4 column grid). The seller dashboard is thumb-friendly for artisans managing orders on smartphones.
4. **Design Palette:** Artisan aesthetic using terracotta (`#C25E34`), alabaster warm surfaces (`#FAF8F5`), charcoal typography, and emerald trust indicators.

---

## 3. Available Scripts

- `npm run dev` — Starts the development server at `http://localhost:5173`.
- `npm run build` — Compiles TypeScript and creates optimized production bundle in `dist/`.
- `npm run preview` — Locally previews the production build.
