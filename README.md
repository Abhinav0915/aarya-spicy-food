# Aarya Spicy Food Frontend

Next.js frontend for Aaryas Spicy Kitchen. The app presents the Ghar Se tiffin service, shows daily menus and pricing, supports customer login/sign-up, lets customers place and manage orders, and includes a staff-facing order dashboard.

## Tech Stack

- Next.js 15 App Router
- React 18 and TypeScript
- Tailwind CSS
- Framer Motion
- lucide-react icons
- Firebase client initialization for analytics/auth support
- Django REST API integration through JWT bearer tokens

## Main Features

- Segment switcher for Ghar Se, Zomato, Swiggy, and Catering.
- Active Ghar Se landing content with hero, plans, menu, breakfast, journey, testimonials, and contact sections.
- Customer sign-up and login backed by Django JWT endpoints.
- Daily order builder with lunch, dinner, economic/premium plan filters, add-ons, basket totals, and notes.
- Add items to existing orders until backend status reaches `preparing`.
- Cancel orders within the backend-defined 60 second window.
- Customer profile page for account updates, password changes, account deletion, and order history.
- Latest active order banner with status progress and 5 second polling.
- Admin login and order dashboard for staff/superusers.
- Static export deployment configured for Firebase Hosting.

## Project Structure

```text
src/app/
  layout.tsx              Global metadata and ThemeProvider
  page.tsx                Landing page composition
  place-order/page.tsx    Customer auth, menu filtering, basket, order submit
  profile/page.tsx        Profile and order history
  admin/login/page.tsx    Staff login
  admin/orders/page.tsx   Staff order dashboard
src/components/layout/    Navbar and footer
src/components/sections/  Landing page sections
src/components/ui/        Latest order banner and WhatsApp button
src/lib/
  api.ts                  API base URL, paths, auth headers
  daily-menu.ts           Plan, menu, includes, and price data
  segment-context.tsx     Service segment state
  theme-context.tsx       Dark/light theme state
  firebase.tsx            Firebase initialization
```

## Environment Variables

Create `.env.local` for local development when the backend is not running at the default URL.

```bash
NEXT_PUBLIC_DJANGO_API_URL=http://127.0.0.1:8000
```

## Getting Started

```bash
npm install
npm run dev
```

Open the local Next.js URL shown in the terminal.

## Available Scripts

```bash
npm run dev      # Next dev server, using .next-dev
npm run build    # Production build/static export, using .next-build and out
npm run start    # Start built app from .next-build
npm run lint     # Next lint command
```

## Backend API Contract

The frontend expects these Django endpoints:

| Purpose | Path |
|---|---|
| Customer sign-up | `POST /signup/` |
| Customer login | `POST /login/` |
| Admin login | `POST /api/admin/login/` |
| Profile update | `PUT/PATCH /profile/` |
| Password change | `POST /change-password/` |
| Account delete | `DELETE /delete-user/` |
| Customer orders | `GET/POST /orders/` |
| Customer order actions | `GET/PATCH /orders/:id/` |
| Admin orders | `GET /api/admin/orders/` |
| Admin order status | `PATCH/PUT /api/admin/orders/:id/` |

Authenticated requests use:

```http
Authorization: Bearer <access-token>
Content-Type: application/json
```

## Client Storage and Events

| Key/Event | Purpose |
|---|---|
| `aaryaAuthUser` | Serialized user profile and staff flags |
| `aaryaAuthToken` | JWT access token |
| `aaryas-active-segment` | Selected service segment |
| `aaryas-theme` | Dark/light theme preference |
| `aaryaDismissedLatestOrderId` | Latest order banner dismissal |
| `aaryaAuthChanged` | Custom event for auth refresh |
| `aaryaOrdersUpdated` | Custom event for order refresh |

## Deployment

The project is configured for static export:

```bash
npm run build
firebase deploy
```

`firebase.json` serves the generated `out` directory. Set `NEXT_PUBLIC_DJANGO_API_URL` to the production backend before building.

## Production Notes

- Keep backend authorization as the source of truth for protected data.
- Lock down Firebase project rules and allowed domains.
- Treat localStorage JWT storage as sensitive and keep XSS protections tight.
- Consider moving pricing authority to the backend so customers cannot submit modified prices.
