import { ProductGrid, ProductSkeletonGrid } from '@/components/native/Product'
import { Heading } from '@/components/native/heading'
import { Separator } from '@/components/native/separator'
import prisma from '@/lib/prisma'
import { isVariableValid } from '@/lib/utils'

import {
   AvailableToggle,
   BrandCombobox,
   CategoriesMultiSelect,
   PriceRange,
   TextSearch,
   SortBy,
} from './components/options'
import { FilterLoadingProvider } from './components/filter-loading'
import GridContainer from './components/grid-container'

export default async function Products({ searchParams }) {
   const {
      sort,
      isAvailable,
      brand,
      category,
      categories: categoriesParam,
      q,
      minPrice,
      maxPrice,
      page = 1,
   } = searchParams ?? null

   const orderBy = getOrderBy(sort)

   const brands = await prisma.brand.findMany()
   const categoriesData = await prisma.category.findMany()

   const min = isVariableValid(minPrice) ? Number(minPrice) : null
   const max = isVariableValid(maxPrice) ? Number(maxPrice) : null
   let discountedIds: string[] | undefined

   if (min !== null || max !== null) {
      if (min !== null && max !== null) {
         const rows = await prisma.$queryRaw<{ id: string }[]>`
            SELECT id FROM "Product"
            WHERE (price - discount) >= ${min} AND (price - discount) <= ${max}
         `
         discountedIds = rows.map((r) => r.id)
      } else if (min !== null) {
         const rows = await prisma.$queryRaw<{ id: string }[]>`
            SELECT id FROM "Product" WHERE (price - discount) >= ${min}
         `
         discountedIds = rows.map((r) => r.id)
      } else if (max !== null) {
         const rows = await prisma.$queryRaw<{ id: string }[]>`
            SELECT id FROM "Product" WHERE (price - discount) <= ${max}
         `
         discountedIds = rows.map((r) => r.id)
      }
   }

   const categoriesList = Array.isArray(categoriesParam)
      ? categoriesParam
      : typeof categoriesParam === 'string' && categoriesParam
      ? categoriesParam.split(',').map((s) => s.trim()).filter(Boolean)
      : category
      ? [category]
      : []

   const categoryTitleFilters = categoriesList.map((t) => ({
      title: { equals: t, mode: 'insensitive' as const },
   }))

   const products = await prisma.product.findMany({
      where: {
         isAvailable: isAvailable == 'true' ? true : undefined,
         ...(q
            ? {
                 OR: [
                    { title: { contains: q, mode: 'insensitive' } },
                    { description: { contains: q, mode: 'insensitive' } },
                    { keywords: { has: q } },
                 ],
              }
            : {}),
         // Apply discounted price filter via precomputed IDs if present
         id: discountedIds ? { in: discountedIds } : undefined,
         brand: {
            title: {
               contains: brand,
               mode: 'insensitive',
            },
         },
         categories: categoriesList.length
            ? {
                 some: {
                    OR: categoryTitleFilters,
                 },
              }
            : category
            ? {
                 some: {
                    title: { equals: category, mode: 'insensitive' },
                 },
              }
            : undefined,
      },
      orderBy,
      skip: (page - 1) * 12,
      take: 12,
      include: {
         brand: true,
         categories: true,
      },
   })

   return (
      <FilterLoadingProvider>
         <Heading
            title="Products"
            description="Below is a list of products you have in your cart."
         />
         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-4">
            <TextSearch initialQuery={q} />
            <PriceRange initialMin={minPrice} initialMax={maxPrice} />
            <CategoriesMultiSelect
               initialCategories={categoriesList}
               categories={categoriesData}
            />
            <BrandCombobox initialBrand={brand} brands={brands} />
            <SortBy initialData={sort} />
            <AvailableToggle initialData={isAvailable} />
         </div>
         <Separator />
         {isVariableValid(products) ? (
            <GridContainer products={products} />
         ) : (
            <ProductSkeletonGrid />
         )}
      </FilterLoadingProvider>
   )
}

function getOrderBy(sort) {
   let orderBy

   switch (sort) {
      case 'featured':
         orderBy = {
            orders: {
               _count: 'desc',
            },
         }
         break
      case 'most_expensive':
         orderBy = {
            price: 'desc',
         }
         break
      case 'least_expensive':
         orderBy = {
            price: 'asc',
         }
         break
      case 'title_asc':
         orderBy = {
            title: 'asc',
         }
         break
      case 'title_desc':
         orderBy = {
            title: 'desc',
         }
         break

      default:
         orderBy = {
            orders: {
               _count: 'desc',
            },
         }
         break
   }

   return orderBy
}
