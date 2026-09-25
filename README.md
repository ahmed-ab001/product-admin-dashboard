# Product Admin Dashboard

A full-featured product management admin dashboard built with Next.js, React, Tailwind CSS v4, and Axios — consuming the [DummyJSON](https://dummyjson.com) public REST API.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Installation](#installation)
4. [Environment / Setup](#environment--setup)
5. [Running Locally](#running-locally)
6. [DummyJSON API Usage](#dummyjson-api-usage)
7. [Features Completed](#features-completed)
8. [URL / Query Parameter Behaviour](#url--query-parameter-behaviour)
9. [Search Race-Condition Solution](#search-race-condition-solution)
10. [Search + Category Limitation](#search--category-limitation)
11. [DummyJSON CRUD Limitation & Local-State Approach](#dummyjson-crud-limitation--local-state-approach)
12. [One Problem Faced](#one-problem-faced)
13. [AI Assistance](#ai-assistance)
14. [Deployment on Vercel](#deployment-on-vercel)
15. [Demo / Login Credentials](#demo--login-credentials)

---

## Project Overview

A responsive, production-grade product administration dashboard. It allows an authenticated user to:

- Browse, search, filter, sort, and paginate a product catalog sourced from DummyJSON.
- View a dedicated detail page for any product, showing images, reviews, and full metadata.
- Add, edit, and delete products with full form validation and confirmation dialogs.
- All changes persist visually for the duration of the browser session via a local mutation overlay (DummyJSON's API does not persist writes).

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| UI Library | React 19 |
| Styling | Tailwind CSS v4 |
| HTTP Client | Axios 1.x (shared instance with interceptors) |
| Data Source | DummyJSON REST API |
| Fonts | Geist Sans / Geist Mono (next/font/google) |

**Intentionally excluded:** React Query, SWR, any pre-built table/pagination library, and any UI component library.

---

## Installation

```bash
# Clone / download the project, then:
cd product-admin-dashboard
npm install
```

No additional packages beyond those listed in `package.json` are required.

---

## Environment / Setup

No `.env` file is required. The DummyJSON base URL (`https://dummyjson.com`) is hardcoded in `src/lib/axios.js`. No API key is needed for DummyJSON.

---

## Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

To run a production build locally:

```bash
npm run build
npm start
```

---

## DummyJSON API Usage

| Endpoint | Method | Used for |
|----------|--------|----------|
| `/auth/login` | POST | Authentication |
| `/auth/me` | GET | Session validation |
| `/products` | GET | Paginated product list |
| `/products/search?q=` | GET | Full-text search |
| `/products/categories` | GET | Category filter list |
| `/products/category/:slug` | GET | Category-filtered product list |
| `/products/:id` | GET | Single product detail |
| `/products/add` | POST | Create product (local-only result) |
| `/products/:id` | PUT | Update product (local-only result) |
| `/products/:id` | DELETE | Delete product (local-only result) |

All requests use the shared Axios instance at `src/lib/axios.js`, which automatically attaches the `Authorization: Bearer <token>` header via a request interceptor, and normalises error messages via a response interceptor.

---

## Features Completed

### Authentication
- Login via `POST /auth/login` with username + password
- Test credentials: **emilys / emilyspass**
- Wrong credentials display a clear inline error message
- Button shows a loading spinner while the request is in-flight
- Duplicate login clicks are prevented via a `lockRef`
- Token stored in `localStorage`, attached to every request via Axios interceptor
- Logout clears token and redirects to `/login`
- All `/products` routes are protected via `<ProtectedRoute>`

### Products List
- Displays image, title, brand, category, price, star rating, and stock status
- Desktop: custom HTML `<table>` (no table library)
- Mobile: card layout (`md:hidden` / `hidden md:block` breakpoints)

### Pagination
- `limit` and `skip` query params sent to the API
- Previous / Next buttons
- Smart page-number window with ellipsis
- Page-size selector: 10 / 20 / 50
- "Showing X–Y of Z" indicator
- State lives entirely in the URL (`?page=&limit=`)
- Invalid URL values (e.g. `page=abc`, `limit=99`) fall back to safe defaults

### Search
- Uses `GET /products/search?q=`
- Input is debounced at 350 ms before triggering a URL update
- Page resets to 1 on every new search term
- Race conditions prevented with `AbortController` (see below)

### Category Filter
- Categories fetched once from `GET /products/categories`
- Selected category drives a URL param (`?category=smartphones`)
- Combined search + category: custom client-side strategy (see below)

### Sorting
- Supports `price-asc`, `price-desc`, `rating-asc`, `rating-desc`, `title-asc`, `title-desc`
- Passed as `sortBy` / `order` params on all list endpoints
- For combined search + category, sorting is applied client-side

### Product Detail Page (`/products/[id]`)
- Full-page route with breadcrumb back-navigation to the list
- Image gallery with thumbnail strip (all `product.images` + `product.thumbnail`)
- Displays: title, brand, category, price, discount %, star rating, stock badge, SKU, warranty, shipping, description, reviews
- Inline Edit and Delete buttons open modals on the detail page itself
- After delete, redirects back to `/products`
- Invalid IDs (non-numeric, `NaN`) show a "Product Not Found" state immediately without an API call
- A DummyJSON 404 response also shows the "Product Not Found" state
- Network errors show a separate error state with Retry

### CRUD
- **Add**: modal form → `POST /products/add` → local state updated via `recordAdd`
- **Edit**: modal form pre-filled → `PUT /products/:id` → local state updated via `recordEdit`
- **Delete**: confirmation dialog → `DELETE /products/:id` → local state updated via `recordDelete`
- All forms validate: required fields, positive price, non-negative stock
- Submit button is disabled and shows a spinner while a request is in-flight
- Duplicate submission is prevented via an `actionLoading` guard (products list) and a `lockRef` (detail page)
- Success and error feedback via a Toast notification

### UX
- Loading skeleton on the detail page
- Loading spinner in the list body
- Empty state with contextual message and "Reset Filters" CTA
- Error state with Retry button
- Confirmation modal before every delete
- Toast notifications for all CRUD outcomes
- Fully responsive on mobile, tablet, and desktop

---

## URL / Query Parameter Behaviour

Refreshing the following URL restores the exact same UI state:

```
/products?page=2&limit=20&search=phone&category=smartphones&sort=price-asc
```

The `useProducts` hook reads all parameters from `useSearchParams()` on every render. `router.replace()` is used (not `push`) so the browser history is not polluted on every keystroke.

| Param | Default | Valid values |
|-------|---------|-------------|
| `page` | `1` | Integer ≥ 1 |
| `limit` | `10` | `10`, `20`, `50` |
| `search` | `""` | Any string |
| `category` | `""` | Any category slug |
| `sort` | `""` | `price-asc`, `price-desc`, `rating-asc`, `rating-desc`, `title-asc`, `title-desc` |

Any value outside the valid set is silently replaced with the default, so no URL can crash the application.

---

## Search Race-Condition Solution

Every time `loadProducts` is called, it first calls `.abort()` on the previous `AbortController` (stored in a `useRef`). A new controller is created and passed as the `signal` to Axios. If the previous request was still in-flight, Axios cancels it, and the response handler checks `axios.isCancel(err)` to silently ignore it.

This guarantees that a slower older request can never overwrite the results of a newer faster request.

---

## Search + Category Limitation

DummyJSON does not support a combined "search within a category" query. The API offers:

- `GET /products/search?q=` — global text search, no category filter
- `GET /products/category/:slug` — category filter, no text search

**Chosen approach:** when both `search` and `category` are active simultaneously, the app:

1. Fetches all items in the selected category using `GET /products/category/:slug?limit=0` (DummyJSON returns the full set when `limit=0`).
2. Filters the results client-side by matching the search term against `title`, `brand`, and `description`.
3. Applies the requested sort and pagination window client-side.

A blue info banner is displayed in the toolbar whenever both filters are active, explaining that the search is scoped to the selected category. A "Search all categories instead" link lets the user clear the category filter quickly.

This is documented explicitly because it differs from a pure server-side search and has a performance implication for very large categories (all items are fetched once).

---

## DummyJSON CRUD Limitation & Local-State Approach

DummyJSON's `POST /products/add`, `PUT /products/:id`, and `DELETE /products/:id` endpoints return realistic-looking success responses but **do not actually persist the changes**. A subsequent `GET /products` will not include the newly created product.

**Strategy (`src/context/ProductMutationsContext.js`):**

A React context backed by `useReducer` tracks three mutation types per browser session:

| Mutation | Storage | Applied via |
|----------|---------|-------------|
| `recordAdd(product)` | `additions[]` | Prepended to the list on page 1 |
| `recordEdit(id, patch)` | `edits{ [id]: patch }` | Merged over matching fetched product |
| `recordDelete(id)` | `deletions Set<id>` | Filtered out from fetched list |

The `useProducts` hook calls `applyToList(rawProducts, rawTotal)` after every API fetch. This `useMemo`-derived view recalculates automatically whenever mutations change — no re-fetch is needed.

The detail page (`/products/[id]`) calls `applyToProduct(fetchedProduct)` to show the locally-edited version, or shows "Product Not Found" if the product was locally deleted.

API calls remain exclusively in `src/services/productService.js`. The mutations context is the only place CRUD state is managed — nothing is scattered across components.

---

## One Problem Faced

**Problem:** The `useProducts` hook originally called `refetch()` (re-fetching from the API) after every CRUD operation. Since DummyJSON doesn't persist mutations, a newly created product would disappear from the list immediately after the refetch.

**Fix:** Separated "raw fetched data" (`rawProducts` / `rawTotal`) from "displayed data". CRUD handlers now call `recordAdd / recordEdit / recordDelete` instead of triggering a refetch. The displayed list is derived by `applyToList` as a `useMemo` over the raw data + mutation store, updating reactively without any network request.

---

## AI Assistance

AI assistance (Antigravity / Claude) was used in this project for:

- Scaffolding the initial Next.js App Router directory structure and boilerplate.
- Suggesting the `AbortController` pattern for race-condition prevention in `useProducts`.
- Drafting the `ProductMutationsContext` reducer and `applyToList` helper.
- Writing JSDoc comments and this README.

All business logic, data flow design, component composition, and Tailwind styling were reviewed, tested, and adjusted manually.

---

## Deployment on Vercel

1. Push the project to a GitHub repository.
2. Log in to [vercel.com](https://vercel.com) and click **"New Project"**.
3. Import the repository — Vercel detects Next.js automatically.
4. No environment variables are required.
5. Click **Deploy**.

The live URL will be available at `https://<your-project>.vercel.app`.

Alternatively, use the Vercel CLI:

```bash
npm i -g vercel
vercel --prod
```

---

## Demo / Login Credentials

| Field | Value |
|-------|-------|
| Username | `emilys` |
| Password | `emilyspass` |
| API | `https://dummyjson.com/auth/login` |

The login page includes a **"Fill Demo Credentials"** button to auto-populate these fields.
