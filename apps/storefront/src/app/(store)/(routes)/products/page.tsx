import { ProductGrid, ProductSkeletonGrid } from '@/components/native/Product'
import { Heading } from '@/components/native/heading'
import { Separator } from '@/components/native/separator'
import { PaginationComponent } from '@/components/ui/pagination'
import prisma from '@/lib/prisma'
import { isVariableValid } from '@/lib/utils'
import { FolderX } from 'lucide-react'

import { FilterButton } from './components/filter-button'
import { SearchInput } from './components/options'

export default async function Products({ searchParams }) {
   const {
      sort,
      isAvailable,
      brand,
      category,
      page = 1,
      search,
      minPrice,
      maxPrice,
   } = searchParams ?? null

   const orderBy = getOrderBy(sort)

   const brands = await prisma.brand.findMany()
   const categories = await prisma.category.findMany()

   const categoryList = category ? category.split('+').filter(Boolean) : null

   const { products, pagination } = await getPaginatedProducts({
      search,
      isAvailable,
      sort,
      brand,
      minPrice,
      maxPrice,
      categoryList,
      page,
      orderBy,
   })

   return (
      <>
         <Heading
            title="Products"
            description="Below is a list of products you have in your cart."
            specialDiv={
               <div className="flex gap-3">
                  <SearchInput initialData={searchParams?.search || ''} />
                  <FilterButton
                     brands={brands}
                     categories={categories}
                     sort={sort}
                     brand={brand}
                     category={category}
                     minPrice={minPrice}
                     maxPrice={maxPrice}
                  />
               </div>
            }
         />
         <Separator />
         {isVariableValid(products) ? (
            <>
               {products.length > 0 ? (
                  <ProductGrid products={products} />
               ) : (
                  <div className="flex flex-col items-center h-[50vh]  justify-center text-muted-foreground opacity-30">
                     <FolderX className="mb-4 h-12 w-12" />
                     <p>No products found.</p>
                  </div>
               )}
            </>
         ) : (
            <ProductSkeletonGrid />
         )}
         <PaginationComponent
            totalPages={pagination.totalPages}
            currentPage={pagination.currentPage}
         />
      </>
   )
}

function getOrderBy(sort) {
   let orderBy

   switch (sort) {
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

export async function getPaginatedProducts({
   search,
   isAvailable,
   sort,
   brand,
   minPrice,
   maxPrice,
   categoryList,
   page = 1,
   pageSize = 10,
   orderBy,
}: {
   search?: string
   isAvailable?: string
   sort?: string
   brand?: string
   minPrice?: string
   maxPrice?: string
   categoryList?: string[]
   page?: number
   pageSize?: number
   orderBy?: any
}) {
   const where = {
      title: search
         ? {
              contains: search,
              mode: 'insensitive' as const,
           }
         : undefined,

      isAvailable: isAvailable == 'true' || sort ? true : undefined,

      brand: brand
         ? {
              id: brand,
           }
         : undefined,

      price:
         minPrice || maxPrice
            ? {
                 gte: minPrice ? Number(minPrice) : undefined,
                 lte: maxPrice ? Number(maxPrice) : undefined,
              }
            : undefined,

      categories: categoryList
         ? {
              some: {
                 OR: categoryList.map((c) => ({
                    title: {
                       contains: c,
                       mode: 'insensitive' as const,
                    },
                 })),
              },
           }
         : undefined,
   }

   const totalCount = await prisma.product.count({ where })

   const totalPages = Math.ceil(totalCount / pageSize)

   const products = await prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
         brand: true,
         categories: true,
      },
   })

   return {
      products,
      pagination: {
         totalCount,
         totalPages,
         currentPage: page,
         pageSize,
      },
   }
}
