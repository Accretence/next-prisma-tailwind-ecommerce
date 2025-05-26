import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import prisma from '@/lib/prisma'
import { endOfDay } from 'date-fns'

import {
   BrandCombobox,
   CategoriesCombobox,
   DateRangePicker,
} from './components/options'
import { LastOrders, TopSellingProducts } from './components/table'

export default async function ReportsPage({ searchParams }) {
   const { from, to, brand, category } = searchParams ?? null

   const categoryArray = category ? category.split(',') : undefined
   const dateFilter =
      from && to
         ? {
              gte: new Date(from),
              lte: endOfDay(new Date(to)),
           }
         : from
           ? {
                gte: new Date(from),
             }
           : to
             ? {
                  lte: endOfDay(new Date(to)),
               }
             : undefined

   const brands = await prisma.brand.findMany()
   const categories = await prisma.category.findMany()
   const orders = await prisma.order.findMany({
      where: {
         createdAt: dateFilter,
         orderItems: {
            some: {
               product: {
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
                  brand: {
                     title: {
                        contains: brand,
                        mode: 'insensitive',
                     },
                  },
               },
            },
         },
      },
      include: {
         orderItems: {
            include: { product: true },
         },
         user: true,
      },
      orderBy: {
         createdAt: 'desc',
      },
   })

   const formattedOrders = orders.map((order) => ({
      id: order.id,
      date: order.createdAt.toISOString().split('T')[0], // Format date as YYYY-MM-DD
      total: order.total,
      customer: order.user ? `${order.user.email}` : 'Guest',
   }))

   const productSalesMap: Record<
      string,
      { productId: string; productName: string; totalSold: number }
   > = {}

   orders.forEach((order) => {
      order.orderItems.forEach((item) => {
         const productId = item.productId

         if (!productSalesMap[productId]) {
            productSalesMap[productId] = {
               productId,
               productName: item.product.title,
               totalSold: 0,
            }
         }

         productSalesMap[productId].totalSold += item.count
      })
   })

   const topSellingProducts = Object.values(productSalesMap).sort(
      (a, b) => b.totalSold - a.totalSold
   )

   return (
      <div className="my-6 block space-y-4">
         <Heading
            title="Admin Reports"
            description="Overview of orders and top-selling products."
         />
         <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-4">
            <DateRangePicker initialFrom={from} initialTo={to} />
            <CategoriesCombobox
               initialCategory={category}
               categories={categories}
            />
            <BrandCombobox initialBrand={brand} brands={brands} />
         </div>

         <Separator />

         <div className="flex flex-col lg:flex-row gap-4">
            <div className="w-full lg:w-1/2">
               <LastOrders data={formattedOrders} />
            </div>
            <div className="w-full lg:w-1/2">
               <TopSellingProducts data={topSellingProducts} />
            </div>
         </div>
      </div>
   )
}
