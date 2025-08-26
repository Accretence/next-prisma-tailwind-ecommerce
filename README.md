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
git clone https://github.com/psyitama/next-prisma-tailwind-ecommerce.git
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

Run the projects

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

## 1️⃣ Rebuild product filters on the storefront page
- Created `ProductSearchInput` with an `onChange` listener to search for products. Applied a debounce feature to prevent concurrent requests while the user has not finalized the keyword.
- Created `PriceInputFields` to filter the minimum and maximum price of the product list. Also created a corresponding button titled "Apply" to trigger the filtering.
- Noticed that the current `Categories` and `Brand` combo boxes are not fully functional. To fix this, I rewrote the UI component using the `Shadcn` documentation as reference.
- Added filter options to the `SortBy` filter to handle sorting of product titles in ascending and descending order.
- Updated the Prisma query to handle `search`, `minPrice`, `maxPrice`, `sort`, `isAvailable`, `brand`, and `category` search parameters.
- Ensured that the product data updates dynamically based on all selected filter options, without reloading the page.
- Commented out `AvailableToggle` as it was not included in part 1 of the assessment.

## 2️⃣ Build an admin reports page with charts or tables
- Tried checking the login and encountered a bug where the `JWT_SECRET_KEY` was being checked on the login page, which is the `UserAuthForm` component rendered on the client (CSR). Removed that line of code and retried logging in, which redirected me to the OTP verification.
- Checked the OTP verification and found out I needed to set up an SMTP account in Google. Used an App Password to fill `MAIL_SMTP_SERVICE`, `MAIL_SMTP_PASS`, and `MAIL_SMTP_USER`. After that, I created a row in the Owner table using my personal email address to receive the OTP code.
- Created a Reports Page by adding `admin/reports` folders in the `(dashboard)/(routes)` path.
- After creating the ReportsPage, I added the link `main-nav /admin/report`.
- Added `'/admin/:path*'` in the `middleware.ts` config to prevent unauthorized access for users without administrator capabilities.
- Also noticed the same issue in the Storefront where the `Categories` and `Brand` combo boxes are not fully functional. To fix it, I rewrote `command.tsx` using the updated version from `Shadcn`.
- **Reports Overview - Orders: Line Chart**
  - Display the order count grouped by date for visualization that the admin can use in reports.
  - Prisma: To fetch the needed data, I used the `Order` table, grouping by `createdAt` while counting the IDs.
  - Displaying: Looped through the results and formatted the date as `'yyyy-MM-dd'` for the chart.
- **Reports Overview - Top Selling Products: Table**
  - Display products with the highest sales first, or by order count. Products with no sales are not listed.
  - Prisma: To fetch the needed data, I used the `Product` table including the `Order` table and counted the order IDs for the Sales number.
  - Displaying: Looped through the results and formatted them according to the table’s requirements.
- Made sure that any changes in the `DateRangePicker`, `Brand`, and `Category` combo box filter options dynamically update the Report Overview Products and Order data without reloading the page.

## 3️⃣ Extend the Product model for cross-sell recommendations
- **3.1: Update Prisma DB Model to Support Cross-Sell Products**

  - Updated the Prisma migration to handle cross-related products by adding the necessary fields to the Product table.

```prisma
crossSellProducts Product[] @relation("CrossSellRelation")
crossSellOf       Product[] @relation("CrossSellRelation")
```
- Run the updated migration using the following command:
```bash
npx prisma migrate dev --name add_cross_sell_products
```
- Populated records by creating a `seed.ts` file and adding the script in `package.json`. This script seeds the database by linking existing products to their related cross-sell products using Prisma’s connect relation.
```package.json
   "prisma": {
      "seed": "tsx prisma/seed.ts"
   }
```
- Started the populating of `crossSellProducts` by running this command.
```bash
npx prisma db seed
```
- **3.2: Enhance Frontend for Cross-Sell Products and Improved Cart
Feedback**
- I usually noticed on well-known e-commerce websites that related or cross-sell products are displayed at the bottom of the page.
- Implemented a toast notification after successfully adding a product to the cart using the `react-hot-toast` package.
- Created a `RelatedProducts` component to display the cross-related products of the selected product.
- Updated the Prisma query and used the `RelatedProducts` component to display the cross-related products below the Product Details and Cart page.
- While testing the adding/removing of quantity on the Cart page, I encountered and fixed a bug where, regardless of which product’s quantity was changed (first, second, or third), the last product in the list was always removed.
