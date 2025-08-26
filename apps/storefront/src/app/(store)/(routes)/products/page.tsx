import { ProductGrid, ProductSkeletonGrid } from '@/components/native/Product'
import { Heading } from '@/components/native/heading'
import { Separator } from '@/components/native/separator'
import prisma from '@/lib/prisma'
import { isVariableValid } from '@/lib/utils'

import {
   AvailableToggle,
   BrandCombobox,
   CategoriesCombobox,
   ProductSearchInput,
   PriceInputFields,
   SortBy,
} from './components/options'

export default async function Products({ searchParams }) {
   const { search, minPrice, maxPrice, sort, isAvailable, brand, category, page = 1 } = searchParams ?? null
   const orderBy = getOrderBy(sort)
   const priceMin = parseFloat(minPrice);
   const priceMax = parseFloat(maxPrice);
   const priceFilter = !isNaN(priceMin) && !isNaN(priceMax) 
   ? { price: { gte: priceMin, lte: priceMax } } 
   : {};
   const filteredCategories = category ? 
      category
         .split(',')
         .map((cat) => cat.trim())
      : 
      undefined
   const isTitleSort = sort === "title_asc" || sort === "title_desc"

   const brands = await prisma.brand.findMany()
   const categories = await prisma.category.findMany()
   const products = await prisma.product.findMany({
      where: {
         isAvailable: (isAvailable == 'true' || sort) && !isTitleSort ? true : undefined,
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
         categories: {
            some: {
               title: {
                  in: filteredCategories,
                  mode: 'insensitive',
               },
            },
         },
         ...priceFilter
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
         <div className="grid grid-cols-1 gap-2 mb-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            <ProductSearchInput initialSearchQuery={search} />
            <PriceInputFields initialMinPrice={priceMin} initialMaxPrice={priceMax} />
            <CategoriesCombobox
               initialCategory={category}
               categories={categories}
            />
            <BrandCombobox initialBrand={brand} brands={brands} />
            <SortBy initialData={sort} />
            {/* <AvailableToggle initialData={isAvailable} /> */}
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
