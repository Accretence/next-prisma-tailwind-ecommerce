import { Heading } from '@/components/ui/heading'
import { PaginationComponent } from '@/components/ui/pagination'
import { Separator } from '@/components/ui/separator'
import prisma from '@/lib/prisma'
import React from 'react'

import ChartComponent from './components/chart-component'
import { FilterButton } from './components/filter-button'
import ReportComponent from './components/report-component'
import TopProductsComponent from './components/top-products-component'

export default async function page({ searchParams }) {
   const { startDate, endDate, category, brand, page } = searchParams ?? null

   const brandList = await prisma.brand.findMany({
      include: {
         products: true,
      },
   })

   const categoriesLists = await prisma.category.findMany({
      include: {
         products: true,
      },
   })

   const { orders, pagination, totalRevenue } = await getPaginatedOrders({
      brand,
      category,
      startDate,
      endDate,
      page: page ? parseInt(page) : 1,
   })

   const topProducts = await getTopProducts({
      brand,
      category,
      startDate,
      endDate,
      topN: 5,
   })

   return (
      <div className="space-y-4 my-6 flex flex-col overflow-hidden">
         <div className="flex items-center justify-between">
            <Heading
               title={`Reports`}
               description="View sales reports and analytics"
            />
            <FilterButton
               brands={brandList}
               categories={categoriesLists}
               brand={brand}
               category={category}
               startDate={startDate}
               endDate={endDate}
            />
         </div>
         <Separator />
         <div className=" flex-1  flex flex-col-reverse lg:flex-row gap-3  h-auto">
            <ReportComponent data={orders} pagination={pagination} />

            <div className="flex-shrink-0  lg:w-[350px] h-auto">
               <ChartComponent
                  orderCount={pagination.totalCount}
                  startDate={startDate}
                  endDate={endDate}
                  totalRevenue={totalRevenue}
               />
               <TopProductsComponent topProducts={topProducts} />
            </div>
         </div>
      </div>
   )
}

/**
 * @description Fetches paginated orders from the database based on optional filters such as brand, category, and date range.
 * @param  {string} [params.brand] - Optional brand ID to filter orders.
 * @param  {string} [params.category] - Optional category string (can include multiple categories separated by '+') to filter orders.
 * @param  {string} [params.startDate] - Optional start date for the date range filter.
 * @param  {string} [params.endDate] - Optional end date for the date range filter.
 * @param  {number} [params.page=1] - The page number for pagination.
 * @param  {number} [params.pageSize=2] - The number of orders to fetch per page.
 * @example
 * getPaginatedOrders({
 *   brand: 'brandId123',
 *   category: 'Electronics+Gadgets',
 *   startDate: '2024-01-01',
 *   endDate: '2024-01-31',
 *   page: 2,
 *   pageSize: 10
 * })
 * @author Harold
 * @returns {Promise<{ orders: Order[]; pagination: { totalCount: number; totalPages: number; currentPage: number; pageSize: number } }>} - An object containing the paginated orders and pagination details.
 */
export async function getPaginatedOrders({
   brand,
   category,
   startDate,
   endDate,
   page = 1,
   pageSize = 8,
}: {
   brand?: string
   category?: string
   startDate?: string
   endDate?: string
   page?: number
   pageSize?: number
}) {
   const where: any = {
      ...(brand || category
         ? {
              orderItems: {
                 some: {
                    product: {
                       ...(brand && { brand: { id: brand } }),
                       ...(category && {
                          categories: {
                             some: {
                                OR: category.split('+').map((c) => ({
                                   title: {
                                      contains: c,
                                      mode: 'insensitive' as const,
                                   },
                                })),
                             },
                          },
                       }),
                    },
                 },
              },
           }
         : {}),
      ...(startDate || endDate
         ? {
              createdAt: {
                 ...(startDate && { gte: new Date(startDate) }),
                 ...(endDate && { lte: new Date(endDate) }),
              },
           }
         : {}),
   }

   // Count orders for pagination
   const totalCount = await prisma.order.count({ where })
   const totalPages = Math.ceil(totalCount / pageSize)

   // Fetch paginated orders
   const orders = await prisma.order.findMany({
      where,
      include: {
         orderItems: {
            include: {
               product: { include: { categories: true } },
            },
         },
         user: true,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
   })

   // Compute revenue using payable (final amount customer paid)
   const revenueOrders = await prisma.order.findMany({
      where,
      select: { payable: true },
   })

   const totalRevenue = revenueOrders.reduce(
      (sum, o) => sum + (o.payable ?? 0),
      0
   )

   return {
      orders,
      pagination: {
         totalCount,
         totalPages,
         currentPage: page,
         pageSize,
      },
      totalRevenue,
   }
}

/**
 * @description Fetches the top N products based on total quantity sold within a specified date range and optional brand/category filters.
 * @param  {string} [params.brand] - Optional brand ID to filter products.
 * @param  {string} [params.category] - Optional category string (can include multiple categories separated by '+') to filter products.
 * @param  {string} [params.startDate] - Optional start date for the date range filter.
 * @param  {string} [params.endDate] - Optional end date for the date range filter.
 * @param  {number} [params.topN=5] - The number of top products to retrieve.
 *
 * @example
 * getTopProducts({
 *    brand: 'brandId123',
 *    category: 'Electronics+Gadgets',
 *    startDate: '2024-01-01',
 *    endDate: '2024-01-31',
 *    topN: 10
 * })
 *
 * @author Harold
 * @returns {Promise<Array<{ quantity: number; product: any }>>} - An array of top products with their total quantities sold.
 */
export async function getTopProducts({
   brand,
   category,
   startDate,
   endDate,
   topN = 5,
}) {
   const where = {
      order: {
         is: {
            createdAt: {
               gte: startDate ? new Date(startDate) : undefined,
               lte: endDate ? new Date(endDate) : undefined,
            },
         },
      },
      product: {
         brand: brand ? { id: brand } : undefined,
         categories: category
            ? {
                 some: {
                    OR: category.split('+').map((c) => ({
                       title: {
                          contains: c,
                          mode: 'insensitive' as const,
                       },
                    })),
                 },
              }
            : undefined,
      },
   }

   // Fetch order items based on filters
   const items = await prisma.orderItem.findMany({
      where,
      include: {
         product: {
            include: { categories: true, brand: true },
         },
      },
   })

   const totals: Record<string, { quantity: number; product: any }> = {}

   // Calculate total quantities
   for (const item of items) {
      if (!totals[item.productId]) {
         totals[item.productId] = { quantity: 0, product: item.product }
      }
      totals[item.productId].quantity += item.count
   }

   return Object.values(totals)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, topN)
}
