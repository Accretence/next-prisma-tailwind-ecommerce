![Screenshot](https://github.com/sesto-dev/next-prisma-tailwind-ecommerce/assets/45223699/00444538-a496-4f90-814f-7e57a580ad17)

<div align="center"><h3>Full-Stack E-Commerce Platform</h3><p>Built using Typescript with Next.js, Prisma ORM and TailwindCSS.</p></div>
<div align="center">
<a href="https://pasargad.vercel.app">Storefront</a> 
<span> · </span>
<a href="https://pardis.vercel.app">Admin Panel</a>
</div>

## 👋 Introduction

Welcome to the open-source Next.js E-Commerce Storefront with Admin Panel project! This project is built with TypeScript, Tailwind CSS, and Prisma, providing a powerful and flexible solution for building and managing your e-commerce website.

## 🥂 Features

-  [x] [**Next.js 14**](https://nextjs.org) App Router and React Server Components.
-  [x] Custom dynamic `Sitemap.xml` generation.
-  [x] Admin dashboard with products, orders, and payments.
-  [x] File uploads using `next-cloudinary`.
-  [x] Authentication using `middleware.ts` and `httpOnly` cookies.
-  [x] Storefront with blog, products, and categories.
-  [x] Database-Stored blogs powered by **MDX** templates.
-  [x] Email verification and invoices using [react-email-tailwind-templates](https://github.com/sesto-dev/react-email-tailwind-templates).
-  [x] [**TailwindCSS**](https://tailwindcss.com/) for utility-first CSS.
-  [x] UI built with [**Radix**](https://www.radix-ui.com/) and stunning UI components, all thanks to [**shadcn/ui**](https://ui.shadcn.com/).
-  [x] Type-Validation with **Zod**.
-  [x] [**Next Metadata API**](https://nextjs.org/docs/api-reference/metadata) for SEO handling.
-  [ ] Comprehensive implementations for i18n.

## 2️⃣ Why are there 2 apps in the app folder?

This project is made up of 2 separate apps ( admin and storefront ) which should be deployed separately. If you are deploying with Vercel you should create 2 different apps.

![image](https://github.com/Accretence/next-prisma-tailwind-ecommerce/assets/45223699/f5adc1ac-9dbb-46cb-bb6e-a8db15883348)

Under the general tab there is a Root Directory option, for the admin app you should put in "apps/admin" and for the storefront app you should put in "apps/storefront".

## 🔐 Authentication

The authentication is handled using JWT tokens stored in cookies and verified inside the `middleware.ts` file. The middleware function takes in the HTTP request, reads the `token` cookie and if the JWT is successfully verified, it sets the `X-USER-ID` header with the userId as the value, otherwise the request is sent back with 401 status.

## 👁‍🗨 Environment variables

Environment variables are stored in `.env` files. By default the `.env.example` file is included in source control and contains
settings and defaults to get the app running. Any secrets or local overrides of these values should be placed in a
`.env` file, which is ignored from source control.

Remember, never commit and store `.env` in the source control, just only `.env.example` without any data specified.

You can [read more about environment variables here](https://nextjs.org/docs/basic-features/environment-variables).

## 🏃‍♂️ Getting Started Locally

Clone the repository.

```bash
git clone https://github.com/sesto-dev/next-prisma-tailwind-ecommerce
```

Navigate to each folder in the `apps` folder and and set the variables.

```sh
cp .env.example .env
```

Get all dependencies sorted.

```sh
bun install
```

Bring your database to life with pushing the database schema.

```bash
bun run db:push
```

```sh
bun run dev
```

## 🔑 Database

Prisma ORM can use any PostgreSQL database. [Supabase is the easiest to work with.](https://www.prisma.io/docs/guides/database/supabase) Simply set `DATABASE_URL` in your `.env` file to work.

### `bun run db`

This project exposes a package.json script for accessing prisma via `bun run db:<command>`. You should always try to use this script when interacting with prisma locally.

### Making changes to the database schema

Make changes to your database by modifying `prisma/schema.prisma`.

## 🛸 How to Deploy the Project

Follow the deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.

## 📄 License

This project is MIT-licensed and is free to use and modify for your own projects. Check the [LICENSE](./LICENSE) file for details.

Created by [Amirhossein Mohammadi](https://github.com/sesto-dev).

## ✨ What’s new in this assessment

### 1) Revamped Product Filters (Storefront)
- Filters: text search (`q`), price range (`minPrice`/`maxPrice`), categories (multi via `categories=a,b,c`), brand, availability, and sort (featured, most/least expensive, A–Z/Z–A).
- UX: URL-driven filters with instant client feedback; local skeleton shows while the route updates.

Notes:
- Server query handles OR text search across `title`, `description`, and `keywords` and respects price range.
- Category filter is case-insensitive and supports multi-select.

### 2) Admin Reports Page
- Filters: date range (`from`, `to`), brand, categories (multi)
- Reports:
  - Orders grouped by date (count + total)
  - Top-selling products (by quantity)
- UX: Filters remain visible; tables show local skeleton while data reloads.

### 3) Cross‑Sell Products
- Prisma: Added optional self many‑to‑many relation on `Product`:
  - `crossSellProducts Product[] @relation("CrossSell")`
  - `crossSellOf Product[] @relation("CrossSell")`
- Admin UI: In the product form, multi-select “Cross‑sell Products”.
- API: Admin `PATCH /api/products/[productId]` accepts `crossSellProducts: string[]` to connect relations.
- Storefront:
  - Product page shows a “You might also like” grid if cross‑sells exist.
  - Cart page aggregates cross‑sell suggestions for items in cart.
  - Add-to-cart shows a toast confirmation.

## 🔗 routes and endpoints

Storefront
- Products listing with filters: `GET /products` (URL query‑driven)
- Product details with cross‑sell: `GET /products/[productId]`
- Cart API: `POST /api/cart` (existing; unchanged contract)

Admin
- Reports page: `GET /reports`
- Product details edit (includes cross‑sell): `GET /products/[productId]`
- Update product (cross‑sell connect): `PATCH /api/products/[productId]`
  Body example:
```json
{
  "title": "New title",
  "price": 10,
  "discount": 0,
  "stock": 5,
  "isFeatured": false,
  "isAvailable": true,
  "crossSellProducts": ["<productId1>", "<productId2>"]
}
```

## 🧠 Design decisions & assumptions
- Filters as URL state: keeps UI shareable/bookmarkable and allows server rendering for result sets while showing immediate local skeletons.
- Case‑insensitive category/brand filters to match human input; multi‑category via `OR`.
- Price filtering honors discounted effective price on storefront lists.
- Reports perform narrow queries with optional date range; local skeletons keep filters visible.
- Cross‑sell chosen as self many‑to‑many for flexibility; admin writes via `connect`. Read paths include minimal fields for cards.
- Cart feedback is intentionally lightweight (toast) to avoid interrupting checkout flow while still acknowledging user action.
