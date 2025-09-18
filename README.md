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
-  [x] Admin dashboard with products, orders, payments, and comprehensive reports.
-  [x] File uploads using `next-cloudinary`.
-  [x] Authentication using `middleware.ts` and `httpOnly` cookies.
-  [x] Storefront with blog, products, categories, and advanced filtering.
-  [x] Database-Stored blogs powered by **MDX** templates.
-  [x] Email verification and invoices using [react-email-tailwind-templates](https://github.com/sesto-dev/react-email-tailwind-templates).
-  [x] [**TailwindCSS**](https://tailwindcss.com/) for utility-first CSS.
-  [x] UI built with [**Radix**](https://www.radix-ui.com/) and stunning UI components, all thanks to [**shadcn/ui**](https://ui.shadcn.com/).
-  [x] Type-Validation with **Zod**.
-  [x] [**Next Metadata API**](https://nextjs.org/docs/api-reference/metadata) for SEO handling.
-  [x] **Advanced Product Filtering** with search, price range, categories, brands, and sorting.
-  [x] **Cross-Sell Product Suggestions** on product pages and cart.
-  [x] **Admin Reports Dashboard** with order analytics and top-selling products.
-  [x] **Responsive Design** optimized for mobile, tablet, and desktop.
-  [ ] Comprehensive implementations for i18n.

## 📁 Project Structure

This project follows a monorepo structure with two separate applications:

```
next-prisma-tailwind-ecommerce/
├── apps/
│   ├── admin/                 # Admin dashboard application
│   │   ├── src/
│   │   │   ├── app/          # Next.js App Router pages
│   │   │   ├── components/   # Reusable UI components
│   │   │   ├── lib/          # Utility functions and Prisma client
│   │   │   └── types/        # TypeScript type definitions
│   │   └── prisma/           # Database schema and migrations
│   └── storefront/           # Customer-facing storefront
│       ├── src/
│       │   ├── app/          # Next.js App Router pages
│       │   ├── components/   # UI components and layouts
│       │   ├── hooks/        # Custom React hooks
│       │   ├── lib/          # Utility functions
│       │   └── state/        # Global state management
│       └── prisma/           # Database schema
├── packages/                  # Shared packages
│   ├── mail/                 # Email templates and utilities
│   ├── oauth/                # OAuth providers
│   └── ...                   # Other shared utilities
└── README.md
```

## 2️⃣ Why are there 2 apps in the app folder?

This project is made up of 2 separate apps ( admin and storefront ) which should be deployed separately. If you are deploying with Vercel you should create 2 different apps.

![image](https://github.com/Accretence/next-prisma-tailwind-ecommerce/assets/45223699/f5adc1ac-9dbb-46cb-bb6e-a8db15883348)

Under the general tab there is a Root Directory option, for the admin app you should put in "apps/admin" and for the storefront app you should put in "apps/storefront".

## 🆕 Recent Updates

### Advanced Product Filtering
- **Text Search**: Search across product titles, descriptions, and keywords
- **Price Range**: Filter products by minimum and maximum price
- **Category & Brand Filters**: Filter by specific categories and brands
- **Availability Toggle**: Show only available products
- **Sorting Options**: Sort by price (high/low), title (A-Z/Z-A), and featured products
- **URL Synchronization**: All filters are reflected in the URL for bookmarking and sharing

### Cross-Sell Product Suggestions
- **Product Page Integration**: "You might also like" section on product detail pages
- **Cart Page Integration**: "Frequently bought together" suggestions on cart page
- **Smart Aggregation**: Combines cross-sell products from all cart items
- **Deduplication**: Removes duplicate suggestions and items already in cart
- **Admin Management**: Full CRUD operations for managing cross-sell relationships

### Admin Reports Dashboard
- **Order Analytics**: View orders grouped by date with revenue and status breakdown
- **Top-Selling Products**: Track most popular products with sales metrics
- **Date Range Filtering**: Filter reports by custom date ranges
- **Category & Brand Filters**: Analyze performance by specific categories or brands
- **Summary Cards**: Quick overview of total revenue, orders, and average order value

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

Generate prisma client schema.

```sh
bun run db:generate
```

Bring your database to life with pushing the database schema.

```bash
bun run db:push
```

Seed the database with dummy data.

```bash
bun run db:seed
```

```sh
bun run dev
```

## 🔑 Database

Prisma ORM can use any PostgreSQL database. [Supabase is the easiest to work with.](https://www.prisma.io/docs/guides/database/supabase) Simply set `DATABASE_URL` in your `.env` file to work.

### Database Schema Features

- **Products**: Full product management with images, pricing, inventory, and metadata
- **Cross-Sell Relationships**: Many-to-many self-relations for product recommendations
- **Categories & Brands**: Hierarchical organization of products
- **Orders & Payments**: Complete order management with status tracking
- **User Management**: Authentication and profile management
- **Cart System**: Persistent cart with local storage and authenticated sync

### `bun run db`

This project exposes a package.json script for accessing prisma via `bun run db:<command>`. You should always try to use this script when interacting with prisma locally.

### Making changes to the database schema

Make changes to your database by modifying `prisma/schema.prisma`.

## 🔌 API Endpoints

### Storefront APIs
- **Products**: `GET /api/products` - List products with filtering and pagination
- **Product Details**: `GET /api/products/[id]` - Get single product details
- **Cross-Sell**: `GET /api/products/[id]/cross-sell` - Get cross-sell products
- **Cart**: `GET/POST /api/cart` - Manage shopping cart

### Admin APIs
- **Reports**: `GET /api/reports/overview` - Dashboard analytics
- **Cross-Sell Management**: Full CRUD for cross-sell relationships