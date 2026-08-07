# Aaryas Spicy Kitchen Frontend

Next.js frontend for Aaryas Spicy Kitchen, a homemade food and tiffin ordering website with customer ordering, profile/order tracking, theme and service-segment switching, and an admin-facing order dashboard.

## Tech Stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 15 App Router |
| UI | React 18, Tailwind CSS |
| Animation | Framer Motion |
| Icons | Lucide React |
| Language | TypeScript |
| Build output | Static export via `output: "export"` |
| Backend API | Django REST API configured by `NEXT_PUBLIC_DJANGO_API_URL` |

## Core Features

- Marketing/home experience for Ghar Se, Zomato, Swiggy, and Catering segments.
- Hydration-safe light/dark theme persistence.
- Customer signup and login using JWT tokens returned by the backend.
- Menu browsing by day, meal category, and plan type.
- Basket management with quantity controls and kitchen notes.
- Place order flow through the Django API.
- Add items to an existing active order until the order reaches `preparing`.
- Cancel order within 60 seconds of placing it.
- Floating latest-order tracker with live status refresh.
- Profile page with order history, status timeline, cancel timer, and add-items actions.
- Admin login and order management dashboard for staff/superusers.

## Project Structure

```text
src/
  app/
    page.tsx                 Home page
    layout.tsx               Root layout and providers
    globals.css              Theme variables and global styles
    place-order/page.tsx     Customer ordering and add-to-order flow
    profile/page.tsx         Profile, order history, cancel/add controls
    admin/
      login/page.tsx         Staff login
      orders/page.tsx        Admin order dashboard
  components/
    layout/                  Navbar and footer
    sections/                Home-page sections
    ui/                      Latest order banner and WhatsApp FAB
  lib/
    api.ts                   API base URL, paths, auth headers
    daily-menu.ts            Menu data and plan helpers
    segment-context.tsx      Segment state
    theme-context.tsx        Theme state
```

## Getting Started

```bash
npm install
npm run dev
```

The dev server uses `.next-dev` through the `NEXT_DIST_DIR` script setting.

Open the app at:

```text
http://localhost:3000
```

## Environment Variables

Create `.env.local` when the backend is not running at the default URL.

```env
NEXT_PUBLIC_DJANGO_API_URL=http://127.0.0.1:8000
```

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js dev server using `.next-dev` |
| `npm run build` | Build static export output using `.next-build` |
| `npm run start` | Start the built app from `.next-build` |
| `npm run lint` | Run Next.js linting |

## Order Flow

1. Customer signs in or creates an account.
2. Customer selects menu items and submits an order.
3. Frontend sends `POST /orders/` with JWT auth.
4. Latest order tracker polls the backend every 5 seconds.
5. Customer may cancel for 60 seconds after order creation.
6. Customer may add items while status is `pending` or `confirmed`.
7. Admin moves the order through `preparing`, `out_for_delivery`, and `completed`.
8. Completed/cancelled orders disappear from the floating active-order tracker.

## Backend Contract

The frontend expects the backend to expose:

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/signup/` | Create customer account |
| `POST` | `/login/` | Customer login |
| `POST` | `/api/admin/login/` | Staff/superuser login |
| `PUT/PATCH` | `/profile/` | Update profile |
| `POST` | `/change-password/` | Change password |
| `DELETE` | `/delete-user/` | Delete account |
| `GET/POST` | `/orders/` | List/create customer orders |
| `GET/PATCH` | `/orders/:id/` | View, cancel, or add items |
| `GET` | `/api/admin/orders/` | List admin orders |
| `PATCH/PUT` | `/api/admin/orders/:id/` | Update order status |

## Notes for Deployment

- The project is configured for static export.
- Configure `NEXT_PUBLIC_DJANGO_API_URL` in the hosting environment.
- Ensure the Django backend allows the frontend origin through CORS.
- Avoid reading browser-only values during the first render; use `useEffect` for `localStorage`, `matchMedia`, and other browser APIs.

