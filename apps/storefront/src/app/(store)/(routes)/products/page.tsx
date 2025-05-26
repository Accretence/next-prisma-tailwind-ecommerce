import { ProductGrid, ProductSkeletonGrid } from '@/components/native/Product'
import { Heading } from '@/components/native/heading'
import { Separator } from '@/components/native/separator'
import prisma from '@/lib/prisma'
import { isVariableValid } from '@/lib/utils'

import {
   AvailableToggle,
   BrandCombobox,
   CategoriesCombobox,
   PriceRangeInput,
   SortBy,
   TextSearchInput,
} from './components/options'

export default async function Products({ searchParams }) {
   const {
      sort,
      search,
      minPrice,
      maxPrice,
      isAvailable,
      brand,
      category,
      page = 1,
   } = searchParams ?? null

   const orderBy = getOrderBy(sort)
   const categoryArray = category ? category.split(',') : undefined
   const minPriceNum = minPrice ? parseFloat(minPrice) : undefined
   const maxPriceNum = maxPrice ? parseFloat(maxPrice) : undefined

   const brands = await prisma.brand.findMany()
   const categories = await prisma.category.findMany()
   const products = await prisma.product.findMany({
      where: {
         isAvailable: isAvailable == 'true' ? true : undefined,
         title: {
            contains: search,
            mode: 'insensitive',
         },
         brand: {
            title: {
               contains: brand,
               mode: 'insensitive',
            },
         },
         categories: categoryArray
            ? {
                 some: {
                    title: {
                       in: categoryArray,
                       mode: 'insensitive',
                    },
                 },
              }
            : undefined,
         price:
            minPriceNum || maxPriceNum
               ? {
                    gte: minPriceNum,
                    lte: maxPriceNum,
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
      <>
         <Heading
            title="Products"
            description="Below is a list of products you have in your cart."
         />
         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-4">
            <TextSearchInput initialData={search} />
            <PriceRangeInput initialMax={maxPrice} initialMin={minPrice} />
            <CategoriesCombobox
               initialCategory={category}
               categories={categories}
            />
            <BrandCombobox initialBrand={brand} brands={brands} />
            <SortBy initialData={sort} />
            <AvailableToggle initialData={isAvailable} />
         </div>
         <Separator />
         {isVariableValid(products) ? (
            <ProductGrid products={products} />
         ) : (
            <ProductSkeletonGrid />
         )}
      </>
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
