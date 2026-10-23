# GearUp 🏔️ — Premium Outdoor Equipment Rental Marketplace

[![Next.js](https://img.shields.io/badge/Next.js-16.4.2-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4.0-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5-ff4154?logo=react-query)](https://tanstack.com/query)
[![Stripe](https://img.shields.io/badge/Stripe_Payments-Checkout-635BFF?logo=stripe)](https://stripe.com)
[![SSLCommerz](https://img.shields.io/badge/SSLCommerz-Sandbox-059669)](https://sslcommerz.com)
[![Google Gemini](https://img.shields.io/badge/AI_Concierge-Gemini-4285F4?logo=google)](https://ai.google.dev/)
[![Biome](https://img.shields.io/badge/Linter-Biome_v1.9-60a5fa?logo=biome)](https://biomejs.dev/)

> A high-performance, enterprise-grade peer-to-peer outdoor equipment rental marketplace. Built with **Next.js 16 (App Router)** and **React 19**, featuring dual-gateway payment checkout (Stripe & SSLCommerz), Edge Middleware payment return handling, grounded AI search & adventure concierge, and role-based portals for Customers, Equipment Providers, and Platform Admins.

---

## 🌐 Live Deployments & API Reference

| Service / Platform | Live Endpoint / URL | Description |
| :--- | :--- | :--- |
| **Live Frontend Application** | [https://gearup-six-kohl.vercel.app](https://gearup-six-kohl.vercel.app) | Production Next.js 16 deployment on Vercel |
| **Live Backend REST API** | [https://gearup-nestjs-server.vercel.app/api/v1](https://gearup-nestjs-server.vercel.app/api/v1) | Production NestJS 12 + PostgreSQL on Vercel |
| **Interactive Swagger API Docs** | [https://gearup-nestjs-server.vercel.app/api/docs](https://gearup-nestjs-server.vercel.app/api/docs) | OpenAPI 3.0 interactive API documentation |
| **Backend Root & Health Check** | [https://gearup-nestjs-server.vercel.app/health](https://gearup-nestjs-server.vercel.app/health) | Real-time service uptime & health check |

---

## ⚡ 1-Click Demo Credentials

Instant one-click demo login cards are available directly on the `/login` page for seamless role evaluation:

| Role | Email Address | Password | Portal Access & Permissions |
| :--- | :--- | :--- | :--- |
| 🛡️ **Platform Admin** | `admin@gearup.com` | `Password123!` | System-wide moderation, user status toggles (Active/Suspended), gear catalog oversight, platform rental audits, financial analytics charts, CSV export. |
| 🏬 **Equipment Provider** | `provider@gearup.com` | `Password123!` | Inventory management (CRUD), real-time stock availability, rental order handoff & return tracking (`CONFIRMED` → `PICKED_UP` → `RETURNED`), shop profile branding. |
| 🥾 **Adventure Customer** | `customer@gearup.com` | `Password123!` | Equipment search & filtering, booking date calculator, dual payment checkout (Stripe USD / SSLCommerz BDT), order receipts, review submissions. |

---

## 💳 Dual Payment Gateway Architecture

GearUp supports international and regional payment methods through a clean, decoupled checkout flow:

```
[Customer selects payment on /orders/[id]/pay]
                 │
      ┌──────────┴──────────┐
      ▼                     ▼
[Stripe Checkout]     [SSLCommerz Sandbox]
  • Currency: USD       • Currency: BDT
  • Hosted session      • Local Cards, MFS (bKash/Nagad)
  • Browser redirect    • Auto-submitting HTML form POST
      │                     │
      └──────────┬──────────┘
                 ▼
 [Next.js Edge Middleware (src/proxy.ts)]
   • Intercepts gateway POST requests
   • Converts to GET via HTTP 303 (See Other)
   • Bypasses Next.js 405 Method Not Allowed & CORS
                 │
                 ▼
 [/payment/success?orderId=...&tranId=...&gateway=...]
   • Confetti celebratory animation
   • Dynamic provider badges (Stripe Blue vs SSLCommerz Emerald)
   • Itemized order breakdown & rental window dates
   • Client hook verifies & confirms order with backend
   • Download / Print receipt button
```

### 1. Payment Method Selection (`/dashboard/customer/orders/[id]/pay`)
- Customers review their rental dates, duration, daily rate, and total cost before selecting:
  - **Stripe Checkout**: International Credit/Debit cards with automatic USD currency conversion.
  - **SSLCommerz**: Local debit/credit cards, internet banking, and Mobile Financial Services (bKash, Nagad, Rocket) in BDT.

### 2. Edge Middleware Payment Interception (`src/proxy.ts`)
- **Problem**: Legacy gateways (like SSLCommerz) return users via an auto-submitting HTML `<form method="POST">`. Next.js App Router page routes (`page.tsx`) only accept `GET`/`HEAD` requests, immediately throwing `HTTP ERROR 405: Method Not Allowed` when POSTed to directly.
- **Solution**: The Next.js Edge Middleware matches `/payment/:path*`, extracts all form payload fields into URL search parameters, and returns `NextResponse.redirect(url, 303)`. Under RFC 7231, status `303 (See Other)` mandates that all web browsers convert the subsequent request to **`GET`**, rendering the receipt page with `HTTP 200 OK`.

### 3. Dynamic Celebratory Receipt Pages
- `/payment/success`: Full-screen confetti, dynamic gateway pill (`Stripe Checkout (USD)` in blue vs `SSLCommerz (BDT)` in emerald), itemized equipment list with quantities and subtotals, copyable transaction reference, and PDF print receipt.
- `/payment/fail`: Failure diagnostics, reason breakdown, and one-click return to retry checkout.
- `/payment/cancel`: Graceful cancellation recovery with direct links back to explore gear or customer dashboard.

---

## 🤖 Grounded AI Features

GearUp integrates **two production AI capabilities** powered by Google Gemini:

### 1. Semantic Search Autocomplete (`AISearchAutocomplete`)
- **Location**: Hero Search Bar (Homepage) and Explore Catalog (`/gear`).
- **Capability**: Real-time debounced suggestions grouping search terms into:
  - *Smart Category Recommendations* (e.g. Mountaineering, Kayaking, Camping)
  - *Suggested Gear Matches* (exact inventory matches with brand & daily price)
  - *Activity Intents* (e.g. winter trail running, multi-day alpine expedition)
- **User Impact**: Eliminates zero-result searches and guides users toward appropriate gear configurations.

### 2. Grounded AI Adventure Concierge (`AIChatAssistant`)
- **Location**: Persistent floating interactive widget on all public pages.
- **Capability**: Conversational assistant that answers wilderness equipment questions, gear sizing, weather suitability, and rental policies.
- **Grounded Inventory**: Directly queries the live database for currently available equipment (`quantityAvailable > 0 && isActive = true`), eliminating AI hallucinations.
- **Interactive UI Cards**: Renders clickable gear cards directly inside the chat stream with daily rates, rating stars, and one-click navigation to equipment details.

---

## 🎨 Design System & UI/UX Standards

- **Color System**:
  - Primary Brand Accent: **Emerald Green** (`#059669` / `#10b981`)
  - Secondary Neutral: **Deep Slate** (`#0f172a` / `#1e293b`)
  - Warm Highlights: **Amber Gold** (`#f59e0b`)
- **Theme Support**: Seamless Dark and Light mode toggling using `next-themes` and Tailwind CSS v4 variables with WCAG contrast compliance.
- **Catalog Layout**: Responsive 4-card grid on desktop (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`) with image aspect ratio consistency and skeleton loading states.
- **Data Integrity**: Realistic gear catalog featuring top outdoor brands (Black Diamond, The North Face, Osprey, MSR, Petzl) with authentic specifications, rental terms, and high-resolution imagery.

---

## 📄 Complete Route Map (31 Prerendered Routes)

```
app/
├── (public)/
│   ├── page.tsx                     # Landing Page (Hero, Search, Featured Grid, Testimonials, FAQ)
│   ├── gear/page.tsx                # Explore Catalog (Debounced Search, Multi-Filter, Sorting)
│   ├── gear/[id]/page.tsx           # Gear Details (Image Gallery, Specifications, Booking Calculator)
│   ├── about/page.tsx               # Company Mission, Environmental Standards, Team
│   ├── contact/page.tsx             # Interactive Contact Form & Coordinates
│   ├── blog/page.tsx                # 6 Outdoor Gear Maintenance & Packing Guides
│   ├── help/page.tsx                # Categorized Searchable FAQ Accordion
│   ├── terms/page.tsx               # Rental Agreement & Liability Policies
│   ├── login/page.tsx               # Authentication with 1-Click Demo Logins
│   ├── register/page.tsx            # Multi-Role Account Creation (Customer/Provider)
│   └── payment/
│       ├── success/page.tsx         # Celebratory Receipt (Confetti, Order Breakdown, Print)
│       ├── fail/page.tsx            # Payment Failure Diagnostics & Retry CTA
│       └── cancel/page.tsx          # Order Cancellation Recovery
├── dashboard/
│   ├── page.tsx                     # Intelligent Role-Based Redirect Router
│   ├── customer/
│   │   ├── page.tsx                 # Customer Overview Stats, Spending Chart, Active Rentals
│   │   ├── orders/page.tsx          # Paginated Orders with Review Modal Trigger
│   │   ├── orders/[id]/pay/page.tsx # Checkout Selection (Stripe vs SSLCommerz)
│   │   ├── payments/page.tsx        # Customer Payment Transaction History Table
│   │   └── profile/page.tsx         # Customer Profile, Address, Emergency Contact
│   ├── provider/
│   │   ├── page.tsx                 # Provider Overview, Revenue Charts, Recent Orders
│   │   ├── gear/page.tsx            # Inventory Management Table (Toggle Active, Edit, Delete)
│   │   ├── gear/new/page.tsx        # Add Equipment Listing Form with Zod Validation
│   │   ├── gear/[id]/page.tsx       # Edit Equipment Specifications & Pricing
│   │   ├── orders/page.tsx          # Incoming Rental Orders with Handoff Status Modal
│   │   └── profile/page.tsx         # Shop Profile, Pickup Location, Branding
│   └── admin/
│       ├── page.tsx                 # Administrative KPIs, Trends Area Chart, Platform Orders
│       ├── users/page.tsx           # User Governance Table (Search, Role Filters, Suspend/Activate)
│       ├── gear/page.tsx            # Catalog Oversight Table with Status Filters
│       ├── rentals/page.tsx         # Platform-Wide Rental Order Audit Table
│       ├── analytics/page.tsx       # Financial Analytics, Utilization Rates, CSV Export
│       └── profile/page.tsx         # Admin Security Credentials & Audit Logs
└── proxy.ts                         # Edge Middleware (Session Auth & 405 Payment Interceptor)
```

---

## 🛠️ Tech Stack & Key Libraries

```json
{
  "framework": "Next.js 16.4.2 (App Router, Turbopack)",
  "language": "TypeScript 5.x (Strict Mode)",
  "ui_library": "React 19.2.8, Radix UI Primitives, Lucide React",
  "styling": "Tailwind CSS v4, tw-animate-css",
  "http_client": "ofetch v1.4.1 (credentials: 'include', dual-token refresh)",
  "server_state": "TanStack React Query v5.67.2",
  "form_validation": "TanStack React Form + Zod v4",
  "charts": "Recharts v2.15.1",
  "notifications": "Sonner v2.0.8",
  "celebration": "canvas-confetti v1.9.4",
  "code_quality": "Biome v1.9.4"
}
```

---

## 🚀 Local Development Setup

### 1. Prerequisites
- Node.js 20+ (recommended: Node.js 22 or 24)
- npm or pnpm

### 2. Clone Repository & Install Dependencies
```bash
git clone https://github.com/myunus-info/gearup-frontend.git
cd gearup-frontend
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the project root:
```env
NEXT_PUBLIC_API_URL=https://gearup-nestjs-server.vercel.app/api/v1
BACKEND_API_URL=https://gearup-nestjs-server.vercel.app/api/v1
NODE_ENV=development
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application with Turbopack.

### 5. Code Quality & Build Verification
```bash
# Run Biome lint & format check
npm run check

# Auto-format codebase
npm run format

# Run TypeScript compilation check
npx tsc --noEmit

# Run full Next.js production build
npm run build
```

---

## 👥 Contributors & Acknowledgements

Developed by **Mohammad Yunus** as part of the advanced full-stack assignment series, demonstrating modern decoupled architecture, enterprise payment gateway orchestration, and grounded AI assistant integration.
