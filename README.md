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

#### Clone the repository.

```bash
git clone https://github.com/CesarF1204/next-prisma-tailwind-ecommerce.git
```

#### Navigate to my branch: *cesar-francisco-vocalmeet-assessment*
```bash
git checkout cesar-francisco-vocalmeet-assessment
```

#### Navigate to each folder in the `apps` folder and and set the variables.

```sh
cp .env.example .env
```

#### Get all dependencies sorted.

```sh
bun install
```

#### Bring your database to life with pushing the database schema.

```bash
bun run db:push
```

#### Run the projects

Storefront

```bash
cd apps/storefront
```

```bash
bun run dev
```
Admin

```bash
cd apps/admin
```

```bash
bun run dev
```

## 🔑 Database

Prisma ORM can use any PostgreSQL database. [Supabase is the easiest to work with.](https://www.prisma.io/docs/guides/database/supabase) Simply set `DATABASE_URL` in your `.env` file to work.

### `bun run db`

This project exposes a package.json script for accessing prisma via `bun run db:<command>`. You should always try to use this script when interacting with prisma locally.

### Making changes to the database schema

Make changes to your database by modifying `prisma/schema.prisma`.

# 🛍️ Storefront & Admin Enhancements

This update focuses on improving the **storefront filtering system**, introducing a new **Admin Reporting Page**, and enhancing the **Prisma DB model** to support **cross-sell functionality**. Additionally, several UI and UX improvements were added to both the storefront and admin panel.

---

## 🚀 Features Overview

### 1. 🧭 Rebuild the Product Page Filter
Enhances the storefront by providing a more dynamic and user-friendly product filtering experience.

#### 🧩 Filter Options
- **Text Search:** Search products by keywords (title or description).
- **Price Range:** Filter products within a specified price range.
- **Categories:** Select one or multiple product categories.
- **Brand:** Filter by product brand.
- **Order Selector:** Sort products by:
  - Most expensive
  - Cheapest
  - Title (A–Z)
  - Title (Z–A)

#### 🧹 Additional Enhancements
- Added a **Reset Filters** button to clear all applied filters including price range, categories, brand, and sort order.

---

### 2. 📊 Admin Reporting Page
Introduces a new admin route `/admin/reports` for generating and analyzing order reports.

#### 🔒 Access Control
- The reporting page is **restricted to administrators only**.

#### 📈 Reports Overview
- **Summary of Orders:** Display total orders grouped by date.
- **Most-Sold Products:** List or table view of top-selling products.

#### 🎛️ Report Filter Options
- **Date Range:** Filter reports by a specific time period.
- **Categories:** Filter report data based on product categories.
- **Brand:** Filter report data by product brand.

#### 📊 Data Presentation
- Visualize report data through **interactive graphs** and well-organized tables.

#### 💰 Additional Admin Features
- Display **Total Orders** and **Total Sales** metrics on the `/admin/reports` page.

---

### 3. 🔗 Extend Prisma DB Model & Enhance Cross-Sell Functionality
Updates the Prisma schema to support product cross-selling and improves the storefront experience.

#### 🗃️ Prisma Schema Update
Added a new self-relation many-to-many field on the `Product` model:

```prisma
// Cross-sell products (self-relation many-to-many)
crossSellProducts Product[] @relation("CrossSell")
crossSellOf       Product[] @relation("CrossSell")
```
- Allows linking multiple products as cross-sell options.
- Includes a seed script to populate the _crossSell table.

#### 🗃️ Storefront Integration
- **Product Page:** Displays cross-sell products under a "Related Products" section if available.
- **Cart Page:** Displays cross-sell suggestions based on items currently in the cart.

#### 🎉 Improved Cart Feedback
- Added a toast notification to confirm when a product is added to the cart.
- Displayed cart item count beside the cart icon for better user feedback.

## 🛸 How to Deploy the Project

Follow the deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.

## 📄 License

This project is MIT-licensed and is free to use and modify for your own projects. Check the [LICENSE](./LICENSE) file for details.

Created by [Amirhossein Mohammadi](https://github.com/sesto-dev).
