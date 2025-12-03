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




## 📘 Developer Assessment Additions (Harold)

### Introduction
This project was developed as part of my Developer Assessment Exam. The goal of the assessment is to extend the existing next-prisma-tailwind-ecommerce application by implementing new features that enhance both the storefront and the admin panel.

The assessment focuses on three major enhancements:

### 1. Rebuilt Product Page Filter

#### Objective
Allow users to filter products by text, price, category, brand, and order.

#### Implementation Details
1) The filtering interface was redesigned to improve usability. Instead of placing all filters directly on the page—which can appear cluttered—secondary filters such as categories, brand, and price range were moved into a popover component. Users typically arrive intending to browse products immediately, so the search bar remains the primary, always-visible control. To address the drawback of hidden filters, a number badge was added to the filter button showing how many filters are currently active.

2) New filtering inputs were implemented for Sort By, Category, Price Range, and Brand. Dispatch was used to batch state updates to prevent excessive re-fetches, particularly during text search.

3) Pagination was added to avoid loading all products at once, improving performance and reducing layout shifts.

#### Testing
- Filtering across multiple categories, search queries, brand selection, and minimum/maximum price was validated.
- Responsiveness was checked to ensure proper layout behavior across different screen sizes.
- The page was tested on multiple devices to confirm consistent performance and functionality.
- Product listings now update dynamically based on user selected filters without requiring a full page refresh.

### 2. Admin Reporting Page

#### Objective
The reporting page provides administrators with tools to view and analyze order data, including:
- Order summaries grouped by date to track sales over time.
- Top‑selling products based on overall sales volume.
- Filter options for date range, product categories, and brand.

#### Implementation Details
1. Added filter inputs for Category, Brand, Date From, and Date To, including validation that prevents Date From being later than Date To, and vice versa.
2. Implemented a Prisma query that fetches orders based on active filters and groups them by date.
3. Added pagination to improve performance and ensure efficient retrieval of large datasets.
4. Developed a flexible top‑selling product function. The current configuration displays the top 5 products, but the limit can be easily changed.
5. Added a summary card showing total revenue and total order count, dynamically updated based on filters.
6. Designed the UI in Figma and implemented it in the Admin panel, including a copy‑to‑clipboard feature for quick access to order IDs.

#### Testing
1. **Filter Functionality**
   - Verified that filtering by Category limits results to products within the selected category.
   - Confirmed that Brand filtering shows only orders containing matching products.
   - Validated date range logic so Date From cannot exceed Date To.
   - Confirmed combined filters (e.g., Category + Date Range) produce accurate results.

2. **Order Grouping**
   - Ensured orders are grouped correctly by date.
   - Cross‑checked totals against sample seed data.

3. **Pagination**
   - Verified smooth navigation between pages.

4. **Top‑Selling Products**
   - Confirmed the Top 5 products display accurately.
   - Adjusted limits (Top 3, Top 10) to validate flexibility.

5. **Summary Cards**
   - Confirmed Total Revenue calculations are accurate.
   - Verified Total Order Count updates with filters.

6. **UI & Responsiveness**
   - Matched the final UI to the Figma design.
   - Tested responsiveness across desktop, tablet, and mobile.
   - Confirmed the order ID copy feature works reliably.

### 3. Extended Prisma Database Model & Cross‑Sell Functionality
- Updated the Prisma `Product` model to include an optional `crossSellProducts` field enabling product‑to‑product relationships.
- Storefront now displays cross‑sell product suggestions on product detail pages.
- The cart UI has been enhanced to show dynamic cross‑sell suggestions along with improved, user‑friendly feedback and notifications.



### Extend Prisma DB Model & Cross-Sell Functionality

#### Objective
Extended the Prisma Product model by adding an optional `crossSellProducts` field to support linking related products. This allows the storefront to display cross-sell suggestions on product detail and cart pages, paired with improved cart feedback to strengthen product discovery.

#### Implementation Details
1. **Schema Update**
   - Modified the Product model to include a self-relation many-to-many field.
   - Added two relational fields, `crossSellProducts` and `crossSellOf`, enabling bidirectional product linking.

2. **Seed Update**
   - Updated the seed script to include products with cross-sell relationships.
   - Ensured multiple products can be linked without affecting existing product data.

3. **API Integration**
   - Implemented an API endpoint that retrieves all `crossSellProducts` for the provided product IDs.

4. **Displaying Suggested Products**
   - Added a product card carousel on the product page to show cross-sell items.
   - Added another carousel in the cart to highlight related suggestions for items currently in the cart.

5. **Frontend Enhancements**
   - Displayed each product’s stock count; items marked `isAvailable = false` are shown as Out of Stock and cannot be added to the cart.
   - Improved Add to Cart flow by allowing users to enter quantity before adding, reducing repeated requests.
   - Added a popup on the cart icon to acknowledge successful additions.
   - After adding a product, a redirect button with a badge appears, showing how many items were added.
   - Added quantity validation based on available stock.
   - Enhanced the cart page to allow quantity edits in a single update action rather than incremental changes.
