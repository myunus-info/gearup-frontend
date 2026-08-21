# GearUp 🏋️

**Rent Sports & Outdoor Gear Instantly**

GearUp is a full-stack gear rental marketplace where customers can browse and rent
camping, climbing, water sports, biking, and winter gear from verified local shops and
adventure providers. It supports three roles — **Customer**, **Provider**, and **Admin** —
each with its own protected dashboard, and integrates with external payment gateways
(SSLCommerz / Stripe) through a backend API.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
  - [Authentication Flow](#authentication-flow)
  - [Route Protection & Middleware](#route-protection--middleware)
  - [Data Fetching](#data-fetching)
- [Application Routes](#application-routes)
- [Backend API](#backend-api)
- [Deployment](#deployment)
- [License](#license)

---

## Overview

GearUp is built with the **Next.js App Router** (RSC) and uses **server actions** for auth
and **TanStack Query** for client-side data fetching. The app is a front-end/client for a
separate backend REST API (see [Backend API](#backend-api)). All business data — users,
gear, rentals, payments, and reviews — lives on the backend; GearUp handles rendering,
routing, auth-token management, and the user experience.

### Roles

| Role       | Dashboard                     | Capabilities                                                                 |
| ---------- | ----------------------------- | ---------------------------------------------------------------------------- |
| `CUSTOMER` | `/dashboard/customer`         | Browse gear, place rentals, pay, track orders, leave reviews, manage profile |
| `PROVIDER` | `/dashboard/provider`         | List/manage gear inventory, manage incoming rental orders, manage profile    |
| `ADMIN`    | `/dashboard/admin`            | Manage users (suspend/activate), oversee gear and rental activity            |

---

## Features

- **Public marketing site** — landing page with hero search, category explorer, featured
  gear grid, "how it works", and a provider call-to-action.
- **Gear catalog** — browse, search, and filter gear by category, brand, price, condition,
  and sort order; detailed gear pages with reviews and ratings.
- **Authentication** — email/password login and registration (customers & providers) via
  server actions, with JWT stored in http-only cookies.
- **Role-based dashboards** — three distinct, role-gated dashboards with sidebar navigation.
- **Rentals & payments** — create rental orders, initiate secure payments through a gateway,
  and track order/payment status.
- **Reviews** — customers can rate and review gear after a rental.
- **Admin controls** — suspend/activate user accounts, view all gear and rentals.
- **Provider tools** — CRUD for gear inventory, update rental order status with optimistic UI.
- **Theming** — light/dark mode via `next-themes` and Tailwind CSS v4.
- **Toasts & loading/error states** — `sonner` notifications, skeletons, and dedicated
  `loading`, `error`, `not-found`, and `global-error` boundaries.
- **Responsive UI** — mobile sheet navigation, shadcn/ui components built on Radix.

---

## Tech Stack

| Category        | Technology                                                        |
| --------------- | ----------------------------------------------------------------- |
| Framework       | [Next.js](https://nextjs.org) 16 (App Router, RSC, `cacheComponents`) |
| UI Library      | React 19                                                          |
| Language        | TypeScript 5                                                      |
| Styling         | Tailwind CSS v4, `tw-animate-css`                                 |
| Components       | shadcn/ui (`radix-vega` style), Radix UI primitives              |
| Data Fetching   | TanStack Query v5 (`@tanstack/react-query`)                       |
| Forms & Validation | React Hook Form, Zod v4, `@hookform/resolvers`               |
| Auth Tokens     | `jsonwebtoken`, `js-cookie`, cookies API                          |
| Theming         | `next-themes`                                                     |
| Notifications   | `sonner`                                                         |
| Icons           | `lucide-react`                                                    |
| Dates           | `date-fns`                                                       |

---

## Prerequisites

- **Node.js** 18.18+ (Node 20+ recommended)
- A running instance of the GearUp backend API (or use the hosted one — see
  [Backend API](#backend-api))
- Package manager: `npm` (also compatible with `yarn`, `pnpm`, `bun`)

---

## Environment Variables

Create a `.env` (or `.env.local`) file in the project root. An empty `.env.example` is
provided as a template.

```bash
# Base URL of the GearUp backend REST API
BACKEND_API_URL=https://gearupapi.vercel.app/api/v1
# BACKEND_API_URL=http://localhost:8000/api/v1   # for a local backend

# Secrets used to verify the JWTs issued by the backend.
# These MUST match the secrets configured on the backend.
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

# Node environment
NODE_ENV=development
```

> **Important:** `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` must match the values used by
> the backend that issues the tokens. The middleware (`proxy.tsx`) and server utilities
> verify tokens locally with these secrets, so a mismatch will reject all authenticated
> requests.

---

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up environment variables** — copy `.env.example` to `.env` and fill in the values
   (see [Environment Variables](#environment-variables)).

3. **Run the development server**

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

| Script           | Description                                  |
| ---------------- | -------------------------------------------- |
| `npm run dev`    | Start the Next.js development server         |
| `npm run build`  | Build the production bundle                 |
| `npm run start`  | Start the production server                 |
| `npm run lint`   | Run ESLint over the codebase                |

---

## Project Structure

```
assignment-5/
├── app/                          # Next.js App Router routes
│   ├── (public)/                # Public, unauthenticated pages
│   │   ├── page.tsx             # Landing page
│   │   ├── gear/                # Gear catalog + gear detail pages
│   │   ├── about/               # About page
│   │   ├── contact/             # Contact page
│   │   └── payment/             # Payment callback pages (success/fail/cancel)
│   ├── auth/                    # Authentication
│   │   ├── login/               # Login page
│   │   ├── register/            # Register page
│   │   ├── _actions/            # Server actions (loginAction, registerAction)
│   │   └── _components/         # LoginForm, RegisterForm
│   ├── dashboard/               # Role-gated dashboards
│   │   ├── customer/            # Customer pages (orders, payments, profile, pay)
│   │   ├── provider/            # Provider pages (gear CRUD, orders, profile)
│   │   └── admin/              # Admin pages (users, gear, rentals, profile)
│   ├── layout.tsx              # Root layout (fonts, providers)
│   ├── globals.css             # Tailwind + theme tokens
│   ├── loading.tsx             # Loading boundary
│   ├── error.tsx               # Error boundary
│   ├── not-found.tsx           # 404 page
│   └── global-error.tsx        # Global error boundary
├── components/                 # Reusable UI
│   ├── ui/                     # shadcn/ui primitives (button, card, dialog, ...)
│   ├── shared/                 # Navbar, footer, gear-card, rent-modal, badges, ...
│   └── dashboard/              # Dashboard shell, sidebar, stats, modals, ...
├── config/                     # App configuration
│   ├── env.ts                  # Typed access to process.env
│   └── sidebar-navs/           # Per-role sidebar navigation configs
├── hooks/                      # TanStack Query hooks
│   ├── use-auth.ts             # useGetMe
│   ├── use-gear.ts             # useGears, useGear, useCategories
│   ├── use-orders.ts           # rentals, payments, reviews mutations/queries
│   ├── use-admin.ts            # admin users/gear/rentals + status mutation
│   ├── use-provider.ts         # provider gear/orders + CRUD mutations
│   └── use-debounce.ts
├── lib/                        # Core libraries
│   ├── request.ts              # Authenticated fetch wrapper to backend
│   ├── auth.ts                 # Access-token resolution + refresh logic
│   ├── utils.ts                # cn(), formatCurrency, formatDate, days calc
│   ├── query-client.ts         # React Query client factory
│   └── validations/           # Zod schemas (auth, gear)
├── services/                   # API service layer (one per domain)
│   ├── auth.service.ts
│   ├── gear.service.ts
│   ├── rental.service.ts
│   ├── payment.service.ts
│   ├── review.service.ts
│   ├── provider.service.ts
│   └── admin.service.ts
├── providers/                  # React context providers (QueryClient, Tooltip, Toaster)
├── types/                      # Shared TypeScript types (User, GearItem, RentalOrder, ...)
├── utils/                      # Server utilities (getMe, logout, guestUser, jwt)
├── proxy.tsx                   # Middleware: route protection & role gating
├── next.config.ts
├── components.json             # shadcn/ui config
└── package.json
```

---

## Architecture

### Authentication Flow

1. The user submits credentials through a **server action** (`app/auth/_actions/loginAction.ts`).
2. The action calls `POST {BACKEND_API_URL}/auth/login` and, on success, receives
   `accessToken` and `refreshToken`.
3. Both tokens are stored in **http-only cookies** (`accessToken` 1-day TTL,
   `refreshToken` 7-day TTL) via the `cookies()` API.
4. The action decodes the access token to determine the user's `role` and redirects to the
   correct dashboard (`/dashboard/admin`, `/dashboard/provider`, or `/dashboard/customer`).
5. On subsequent requests, `lib/request.ts` reads the access token from cookies and attaches
   it as a `Bearer` header when calling the backend (`requiresAuth: true` by default).

### Token Refresh

Access tokens are short-lived. When `lib/auth.ts#accessTokenExists()` finds an expired
access token but a valid refresh token, it silently calls the backend's
`/api/auth/refresh-token` endpoint and writes the new access token back into the cookies.
The middleware (`proxy.tsx`) performs the same refresh check before allowing protected
routes.

### Route Protection & Middleware

`proxy.tsx` (mapped via the `config.matcher` in the same file) runs on every request except
static assets and API routes. It:

- Verifies the access token; if expired but a valid refresh token exists, it refreshes and
  sets a fresh `accessToken` cookie.
- Redirects **logged-in** users away from `/auth/login` and `/auth/register` to their
  dashboard.
- Redirects **unauthenticated** users on protected routes to `/auth/login?redirectTo=<path>`.
- **Role-gates** each dashboard: a user whose role doesn't match the dashboard prefix is
  redirected to `/not-found`.

Public routes (always accessible): `/`, `/gear`, `/about`, `/contact`, `/payment`.

### Data Fetching

- **Server-side** reads of the current user use `utils/getMe.ts`, which calls
  `/auth/me` with the access-token cookie and caches the result with the `my-profile` tag
  (invalidated on logout).
- **Client-side** data flows through the **service layer** (`services/*`) → wrapped by
  **TanStack Query hooks** (`hooks/*`). `lib/request.ts` is the single authenticated fetch
  primitive.
- Mutations (create order, add gear, update status, change user status) use
  `useMutation` with optimistic updates where relevant (`use-provider`, `use-admin`).

---

## Application Routes

### Public

| Route                    | Page                                          |
| ------------------------ | --------------------------------------------- |
| `/`                      | Landing / home                                |
| `/gear`                  | Gear catalog (search & filter)                |
| `/gear/[id]`             | Gear detail page                              |
| `/about`                 | About                                         |
| `/contact`               | Contact                                       |
| `/payment/success`       | Payment success callback                      |
| `/payment/fail`          | Payment failure callback                      |
| `/payment/cancel`        | Payment cancellation callback                 |

### Auth

| Route               | Page              |
| ------------------- | ----------------- |
| `/auth/login`       | Login             |
| `/auth/register`    | Register          |

### Customer Dashboard

| Route                                  | Page                     |
| -------------------------------------- | ------------------------ |
| `/dashboard/customer`                  | Overview                 |
| `/dashboard/customer/orders`           | My orders                |
| `/dashboard/customer/orders/[id]/pay`  | Pay for an order         |
| `/dashboard/customer/payments`         | My payments              |
| `/dashboard/customer/profile`          | Profile                  |

### Provider Dashboard

| Route                              | Page                  |
| ---------------------------------- | --------------------- |
| `/dashboard/provider`              | Overview              |
| `/dashboard/provider/gear`         | My gear list          |
| `/dashboard/provider/gear/new`     | Add gear              |
| `/dashboard/provider/gear/[id]`    | Edit gear             |
| `/dashboard/provider/orders`       | Incoming orders       |
| `/dashboard/provider/profile`      | Profile               |

### Admin Dashboard

| Route                          | Page                |
| ------------------------------ | ------------------- |
| `/dashboard/admin`            | Overview            |
| `/dashboard/admin/users`       | Manage users        |
| `/dashboard/admin/gear`        | All gear            |
| `/dashboard/admin/rentals`     | All rentals         |
| `/dashboard/admin/profile`     | Profile             |

---

## Backend API

GearUp is the front-end for a separate REST API. By default it points at the hosted
instance:

```
https://gearupapi.vercel.app/api/v1
```

The service layer (`services/*.ts`) and `lib/request.ts` wrap these endpoints:

| Domain    | Endpoint(s)                                                          |
| --------- | -------------------------------------------------------------------- |
| Auth      | `POST /auth/login`, `POST /auth/register`, `GET /auth/me`, `POST /auth/refresh-token` |
| Gear      | `GET /gears`, `GET /gears/[id]`, `GET /categories`                   |
| Rentals   | `POST /rentals`, `GET /rentals`, `GET /rentals/[id]`                 |
| Payments  | `POST /payments/create`, `GET /payments`, `POST /payments` (confirm) |
| Reviews   | `POST /reviews`                                                      |
| Provider  | `GET/POST /provider/gear`, `GET/PUT/DELETE /provider/gear/[id]`, `GET/ PATCH /provider/orders/[id]` |
| Admin     | `GET /admin/users`, `PATCH /admin/users/[id]`, `GET /admin/gear`, `GET /admin/rentals` |

---

## Deployment

The easiest way to deploy is [Vercel](https://vercel.com) (the framework this project is
built on):

1. Push the repository to GitHub/GitLab/Bitbucket.
2. Import the project into Vercel.
3. Set the environment variables listed in
   [Environment Variables](#environment-variables) in the Vercel project settings.
4. Deploy — `npm run build` is run automatically.

> Ensure `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` on the deployed instance match the
> backend that issues the tokens.

---

## License

This project is provided for educational/coursework purposes (assignment-5 of the
phero-batch7 course).
