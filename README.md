# GearUp 🏔️ — Premium Outdoor Equipment Rental Marketplace

[![Next.js](https://img.shields.io/badge/Next.js-16.4.2-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4.0-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5-ff4154?logo=react-query)](https://tanstack.com/query)
[![Backend API](https://img.shields.io/badge/Backend_API-NestJS-E0234E?logo=nestjs)](https://gearup-nestjs-server.vercel.app)

> A modern, full-stack peer-to-peer equipment rental application built with **Next.js 16.4.2 (App Router)** and **Assignment-7 Next.js Frontend Architecture**, consuming the live production **NestJS + TypeORM API** at `https://gearup-nestjs-server.vercel.app`.

---

## 🌐 Live URLs & Backend Reference

| Platform / Service | URL / Link |
| :--- | :--- |
| **Backend API (Live NestJS + TypeORM)** | [https://gearup-nestjs-server.vercel.app](https://gearup-nestjs-server.vercel.app) |
| **Backend Swagger API Docs** | [https://gearup-nestjs-server.vercel.app/api/docs](https://gearup-nestjs-server.vercel.app/api/docs) |
| **Frontend Repository** | Current Monorepo / `gearup-client` |
| **Backend Repository** | Monorepo / `gearup-server` |

---

## ⚡ 1-Click Demo Credentials

Instant one-click demo login buttons are provided on the `/auth/login` page for fast role evaluation:

| Role | Email Address | Password | Permissions & Portal Access |
| :--- | :--- | :--- | :--- |
| 🛡️ **Platform Admin** | `admin@gearup.com` | `Password123!` | Full user moderation, platform rentals audit, inventory moderation, dynamic financial analytics |
| 🏬 **Equipment Provider** | `provider@gearup.com` | `Password123!` | Inventory CRUD, order handoff & return status management, shop profile customization, revenue stats |
| 🥾 **Adventure Customer** | `customer@gearup.com` | `Password123!` | Gear reservations, order checkout & payments, return reviews, customer profile |

---

## 🤖 AI Features Implemented

GearUp integrates **two production AI features** to deliver an intelligent, guided outdoor rental experience:

### 1. Semantic AI-Powered Search Suggestions (`AISearchAutocomplete`)
- **Location**: Hero Search Bar (Homepage) and Explore Catalog Page (`/gear`).
- **Capability**: Real-time semantic debounced suggestions as the user types, grouping results into "Smart Category Recommendations", "Suggested Gear Matches", and "Activity Intents" (e.g., winter camping, trail running, mountain climbing).
- **User Value**: Eliminates zero-result searches and dynamically predicts equipment needs based on outdoor activity keywords.

### 2. Platform-Wide AI Adventure Concierge (`AIChatAssistant`)
- **Location**: Floating persistent interactive concierge widget on all public pages.
- **Capability**: Natural-language conversational AI assistant that understands wilderness packing requirements, weather condition suitability, equipment sizing, and rental policies.
- **Dynamic Catalog Cards**: Directly queries and renders interactive, clickable gear recommendation cards with rates, ratings, and immediate "View Equipment" routes inside the chat stream.

---

## 🎨 Global UI & Design System

- **Color Palette (Max 3 Primary)**:
  - Primary Accent: **Emerald Green** (`#059669` / `#10b981`)
  - Secondary / Neutral: **Deep Slate** (`#0f172a` / `#1e293b`)
  - Warm Highlights: **Amber Gold** (`#f59e0b`)
- **Light & Dark Mode**: Full system and manual theme toggling via `next-themes` and Tailwind CSS v4 CSS variables with strict WCAG contrast compliance.
- **Consistent Card Geometry**: Uniform height, width, and border radii (`rounded-2xl` / `rounded-3xl`) across all gear listings and dashboard stat widgets.
- **Core Listing Rules**: **4 cards per row on desktop** (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`) with skeleton loaders during data fetching.
- **Zero Placeholder Content**: 100% realistic outdoor gear names, specifications, rates, brands (The North Face, Osprey, Black Diamond, MSR), and imagery.

---

## 📄 Page Architecture & Route Inventory (34 Prerendered Routes)

### 1. Public Marketing & Exploration
- `/`: **Homepage / Landing Page** with smooth scrolling, lazy loading, 65vh interactive Hero with CTA and search, categories grid, 4 cards/row featured gear, how-it-works guide, value propositions, impact stats, testimonials, AI spotlight, provider CTA, FAQ accordion, and newsletter.
- `/gear`: **Explore / Catalog Listing** with debounced search, 3+ filter fields (category, price range, condition, brand), sorting, active filter pills, and pagination.
- `/gear/[id]`: **Details Page** with multi-image gallery thumbnails, overview, key specifications, provider shop card, verified customer reviews, sticky date & price booking calculator, and related items grid.
- `/about`: Company mission, safety standards, environmental stewardship, and leadership team.
- `/contact`: Interactive contact form with form validation and direct coordinates.
- `/blog`: 6 outdoor equipment guides, packing checklists, and gear maintenance articles.
- `/help`: Categorized searchable FAQ accordion, resolution timelines, and support desk.
- `/terms`: Equipment rental agreement, liability guidelines, and security policies.

### 2. Role-Based Dashboards
- `/dashboard`: Intelligent role router redirecting users to their dedicated portal.
- **Customer Portal (4 Core Pages)**:
  - `/dashboard/customer`: Overview stat cards, gear spending chart, and active reservations.
  - `/dashboard/customer/orders`: Paginated and filterable rental orders with review modal.
  - `/dashboard/customer/orders/[id]/pay`: Checkout session with SSLCommerz gateway handoff.
  - `/dashboard/customer/payments`: Transaction history and receipts table with pagination.
  - `/dashboard/customer/profile`: Editable customer profile, delivery address, and emergency contact.
- **Provider Portal (5 Core Pages)**:
  - `/dashboard/provider`: Portal overview, revenue bar chart, category distribution pie chart, and pending orders.
  - `/dashboard/provider/gear`: Paginated inventory management table with toggle active, edit, and delete.
  - `/dashboard/provider/gear/new`: Add equipment listing with Zod validation.
  - `/dashboard/provider/gear/[id]`: Edit existing equipment specifications and pricing.
  - `/dashboard/provider/orders`: Paginated incoming orders with `OrderStatusModal` for pickup/return handoffs.
  - `/dashboard/provider/profile`: Editable shop branding, representative info, and pickup location.
- **Admin Portal (6 Core Pages)**:
  - `/dashboard/admin`: Platform KPIs, revenue bar chart, category pie chart, trends area chart, and recent orders table.
  - `/dashboard/admin/users`: User governance table with search, role filters, pagination, and instant suspend/activate toggles.
  - `/dashboard/admin/gear`: Catalog oversight table with status filters and pagination.
  - `/dashboard/admin/rentals`: Platform-wide rental audit table with status filters and pagination.
  - `/dashboard/admin/analytics`: Dynamic financial analytics, category demand utilization rates, and CSV export.
  - `/dashboard/admin/profile`: Administrative security credentials and audit coordinates.

### 3. Payment Callbacks
- `/payment/success`: Confetti celebration, order confirmation trigger, transaction reference copy, and print receipt.
- `/payment/fail`: Failure diagnosis and retry checkout CTA.
- `/payment/cancel`: Graceful cancellation recovery.

---

## 🛠️ Tech Stack & Dependencies

```json
{
  "framework": "Next.js 16.4.2 (App Router, Turbopack, cacheComponents)",
  "ui": "React 19.2.8, Radix UI primitives, Lucide React 1.31.0",
  "styling": "Tailwind CSS v4, tw-animate-css",
  "client_api": "ofetch (credentials: 'include', dual-token fallback)",
  "server_state": "TanStack React Query v5.67.2",
  "form_validation": "React Hook Form, Zod v4, @hookform/resolvers",
  "visualizations": "Recharts v2.15.1",
  "notifications": "Sonner v2.0.8",
  "code_quality": "Biome v1.9.4, TypeScript 5"
}
```

---

## 🚀 Local Development Setup

### 1. Clone & Install
```bash
git clone <repository-url>
cd gearup-client
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
NEXT_PUBLIC_API_URL=https://gearup-nestjs-server.vercel.app/api/v1
BACKEND_API_URL=https://gearup-nestjs-server.vercel.app/api/v1
NODE_ENV=development
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Code Formatting & Production Build
```bash
# Run Biome formatting & lint check
npm run check
npm run format

# Run full Next.js production build
npm run build
```

---

## 📜 Final Submission Summary

- **Live Frontend**: Deployed on Vercel
- **Live Backend API**: `https://gearup-nestjs-server.vercel.app`
- **Frontend Codebase**: `gearup-client` (scaffolded strictly in `src/` following Assignment-7 architecture)
- **Backend Codebase**: `gearup-server` (NestJS 11 + TypeORM + PostgreSQL on Supabase)
- **Demo Accounts Tested**:
  - Admin: `admin@gearup.com` | `Password123!`
  - Provider: `provider@gearup.com` | `Password123!`
  - Customer: `customer@gearup.com` | `Password123!`
- **Git Commit History**: Fully preserved from Assignment-5 baseline with structured commit checkpoints.
