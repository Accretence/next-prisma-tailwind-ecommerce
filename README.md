This project implements all three parts of the technical challenge using **Next.js**, **Prisma**, **Tailwind CSS**, **shadcn/ui**, and React best practices.

## 🚧 Setting things up

To make sure project runs as expected a few steps first:

-  Clone the repository.

```bash
git clone https://github.com/sesto-dev/next-prisma-tailwind-ecommerce
```

-  Checkout to Assessment branch.

```bash
git checkout arthur-test
```

-  Create your own .env files in both admin and storefront projects. (Some variables won't be used here)

-  The next few commands should be used in both admin and storefront projects. Install dependencies.

```bash
bun install
```

-  Setup a project in Supabase (recommended) or PostgreSQL database of your choice

   -  Create an account or login with your account in Supabase
   -  Create a new project, saving project's password (you'll need that in next step)
   -  In order to make Prisma terminal commands work, first I followed steps 1 and 3 in this [connecting Prisma to Supabase tutorial](https://supabase.com/docs/guides/database/prisma).

-  After setting up your DATABASE_URL in .env file run this command to create tables in database.

```bash
bun run db:push
```

-  Then run this to pupulate tables.

```bash
bun run db:seed
```

-  Now you should be able to run each project with.

```bash
bun run dev
```

Note: I took some time trying to make SMTP and JWT variables to work, but then realized they weren't necessary to this accessment. As for part 2 in admin report page, tested whole page without permission control, then added it to `middleware.ts` matcher list.

---

## 1️⃣ Rebuild product filters on the storefront page

-  Fixed **Brand** and **Categories** filters as they were using conflicting versions of `cmdk` and shadcn's `CommandItem` style.
-  Made so **Categories** filter can handle more than one item selected and added new A-Z and Z-A options to **Order** filter.
-  Created new **TextSearch** and **PriceRange** filters. Those filters use a debounce feature so user won't have to type enter to filter page with them.
-  Updated the Prisma query to handle:
   -  Filtering products by selected categories (`category.title IN [...]`).
   -  Filtering products by title, price range and two new orderBy options (A-Z and Z-A).
-  Used `next/navigation` hooks (`useSearchParams`, `useRouter`, `usePathname`) to synchronize filters with the URL query string.
-  Ensured the page updates dynamically as filters change, without full reload.
-  Note: Removed "Featured" option in SortBy because it wasn't asked for in assessment notes, but kept `AvailableToggle` just because I thought it was a nice filter.

---

## 2️⃣ Build an admin reports page with charts or tables

-  Created a new `ReportsPage` under the admin app.
-  Ensured that page is only accessible to administrators.
-  Displayed two main data tables:
   -  **Last Orders**: showing recent orders with date, total, and customer email.
   -  **Top-Selling Products**: ranked list of products sorted by total quantity sold.
-  Pulled data from Prisma with:
   -  Relations: included `orderItems.product` and `user`.
   -  Ordering: sorted orders by `createdAt DESC`.
-  Formatted data client-side for easy table consumption.
-  Added **Brand** and **Categories** filters, the same ones used in storefront products page.
-  Created new **DateRange** filter based on shadcn docs. Had to install shadcn's `Calendar` for that.
-  Ensured the page updates dynamically as filters change, without full reload.
-  Applied a small fix with `date-fns` to ensure the end date (`to`) includes the full day (i.e., `endOfDay(to)`).

---

## 3️⃣ Extend the Product model for cross-sell recommendations

-  Updated the Prisma schema to add a **crossSellProducts** relation on the `Product` model.
-  Added crossSell in `seed.ts` so after running migration and database commands products are randomly given crossSell relations. Tested field in Supabase pannel.
-  Added a **You Might Also Like** section:
   -  On the **Product Details** page: showing related products to encourage cross-selling.
   -  On the **Cart** page: displaying recommended products alongside the shopping cart. Here ensured that this section showed crossSell products related to all items in cart while also preventing duplicated suggestions and items already in cart to appear there.
-  Ensured crossSell suggestions are clickable and take the user to product page while suggestions list is aligned with project design and responsiveness.
-  Implemented better UX feedback when adding products to the cart:
   -  Integrated a `toast` notification using `shadcn/ui`. Chose that one because it was already installed in project and I'm used to work with it.
   -  Gave users immediate visual confirmation of their action when a product is added or removed from cart. Toast will also appear if there's a `try/catch` error when adding/removing items from cart.

---

## 🚀 Final Touches

-  Used TypeScript types, especially on date-related states (`DateRange`).
-  Ensured no runtime errors when filters are partially filled (e.g., only `from` date selected).
-  Maintained consistent design and UX patterns across storefront and admin pages.

### Original README from here

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
