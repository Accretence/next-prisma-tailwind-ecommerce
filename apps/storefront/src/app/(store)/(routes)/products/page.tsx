import { ProductGrid, ProductSkeletonGrid } from '@/components/native/Product'
import { ProductFilter } from '@/components/native/ProductFilter'
import { Pagination } from '@/components/native/Pagination'
import { Heading } from '@/components/native/heading'
import { Separator } from '@/components/native/separator'
import prisma from '@/lib/prisma'
import { isVariableValid } from '@/lib/utils'

export default async function Products({ searchParams }) {
   const { 
      search, 
      minPrice, 
      maxPrice, 
      brand, 
      category, 
      sort, 
      isAvailable, 
      page = 1 
   } = searchParams ?? {}

   // Build where clause for server-side filtering
   const where: any = {}

   // Text search across title, description, and keywords
   if (search) {
      where.OR = [
         {
            title: {
               contains: search,
               mode: 'insensitive',
            },
         },
         {
            description: {
               contains: search,
               mode: 'insensitive',
            },
         },
         {
            keywords: {
               hasSome: [search],
            },
         },
      ]
   }

   // Price range filter
   if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) {
         where.price.gte = parseFloat(minPrice)
      }
      if (maxPrice) {
         where.price.lte = parseFloat(maxPrice)
      }
   }

   // Brand filter
   if (brand) {
      where.brand = {
         title: {
            contains: brand,
            mode: 'insensitive',
         },
      }
   }

   // Category filter
   if (category) {
      where.categories = {
         some: {
            title: {
               contains: category,
               mode: 'insensitive',
            },
         },
      }
   }

   // Availability filter
   if (isAvailable === 'true') {
      where.isAvailable = true
   }

   const orderBy = getOrderBy(sort)

   const brands = await prisma.brand.findMany()
   const categories = await prisma.category.findMany()
   
   // Get total count for pagination
   const totalCount = await prisma.product.count({ where })
   
   const products = await prisma.product.findMany({
      where,
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
            description="Discover our amazing collection of products with advanced filtering options."
         />
         
         <div className="mb-6">
            <ProductFilter 
               brands={brands}
               categories={categories}
               searchParams={searchParams}
            />
         </div>
         
         <Separator />
         
         {isVariableValid(products) ? (
            <ProductGrid products={products} />
         ) : (
            <ProductSkeletonGrid />
         )}
         
         <Pagination
            currentPage={Number(page)}
            totalPages={Math.ceil(totalCount / 12)}
            totalItems={totalCount}
            itemsPerPage={12}
         />
      </>
   )
}

function getOrderBy(sort) {
   let orderBy

   switch (sort) {
      case 'featured':
         orderBy = {
            isFeatured: 'desc',
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
            isFeatured: 'desc',
         }
         break
   }

   return orderBy
}
