import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { isVariableValid } from '@/lib/utils'
import Filters from './components/filters'
import { ReportsLoadingProvider } from './components/loading-context'
import TableContainer from './components/table-container'

type SearchParams = {
   from?: string
   to?: string
   categories?: string // comma-separated titles
   brand?: string
}

function getDateRange(from?: string, to?: string) {
   if (!from && !to) return null
   const start = from ? new Date(from) : new Date(0)
   const end = to ? new Date(to) : new Date()
   start.setHours(0, 0, 0, 0)
   end.setHours(23, 59, 59, 999)
   return { start, end }
}

export default async function ReportsPage({ searchParams }: { searchParams: SearchParams }) {
   const range = getDateRange(searchParams?.from, searchParams?.to)
   const categoriesList = (searchParams?.categories || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
   const brandTitle = searchParams?.brand

   const [brands, categories] = await Promise.all([
      prisma.brand.findMany(),
      prisma.category.findMany(),
   ])

   // Build where for products based on filters
   const productWhere: Prisma.ProductWhereInput = {
      ...(isVariableValid(brandTitle)
         ? { brand: { is: { title: { equals: brandTitle!, mode: 'insensitive' } } } }
         : {}),
      ...(categoriesList.length
         ? {
              categories: {
                 some: { OR: categoriesList.map((t) => ({ title: { equals: t, mode: 'insensitive' as const } })) },
              },
           }
         : {}),
   }

   // Orders grouped by date (paid orders)
   const orders = await prisma.order.findMany({
      where: {
         createdAt: range ? { gte: range.start, lte: range.end } : undefined,
         orderItems: Object.keys(productWhere).length
            ? { some: { product: productWhere } }
            : undefined,
      },
      include: { orderItems: true },
      orderBy: { createdAt: 'asc' },
   })

   const ordersByDate = new Map<string, { count: number; total: number }>()
   for (const order of orders) {
      const key = order.createdAt.toISOString().slice(0, 10)
      const current = ordersByDate.get(key) || { count: 0, total: 0 }
      const orderTotal = order.orderItems.reduce((sum, item) => sum + (item.price - (item.discount || 0)), 0)
      ordersByDate.set(key, { count: current.count + 1, total: current.total + orderTotal })
   }
   const ordersTable = Array.from(ordersByDate.entries()).map(([date, agg]) => ({ date, ...agg }))

   // Top selling products (by quantity in order items) with same filters
   const group = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { count: true },
      where: {
         ...(range ? { order: { createdAt: { gte: range.start, lte: range.end } } } : {}),
         product: productWhere,
      },
      orderBy: { _sum: { count: 'desc' } },
      take: 10,
   })

   const products = await prisma.product.findMany({
      where: { id: { in: group.map((g) => g.productId) } },
      include: { brand: true, categories: true },
   })

   const topProducts = group.map((g) => ({
      product: products.find((p) => p.id === g.productId),
      sold: g._sum.count || 0,
   }))

   return (
      <ReportsLoadingProvider>
         <Heading title="Reports" description="Overview of orders and top products." />
         <div className="mt-4">
            <Filters brands={brands} categories={categories} initial={{
               from: searchParams?.from,
               to: searchParams?.to,
               brand: brandTitle,
               categories: categoriesList,
            }} />
         </div>
         <Separator className="my-4" />
         <TableContainer>
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="border rounded-md p-4">
               <h3 className="font-semibold mb-2">Orders by date</h3>
               <table className="w-full text-sm">
                  <thead>
                     <tr className="text-left border-b">
                        <th className="py-2">Date</th>
                        <th className="py-2">Orders</th>
                        <th className="py-2">Total</th>
                     </tr>
                  </thead>
                  <tbody>
                     {ordersTable.map((row) => (
                        <tr key={row.date} className="border-b last:border-0">
                           <td className="py-2">{row.date}</td>
                           <td className="py-2">{row.count}</td>
                           <td className="py-2">${row.total.toFixed(2)}</td>
                        </tr>
                     ))}
                     {!ordersTable.length && (
                        <tr>
                           <td colSpan={3} className="py-4 text-center text-muted-foreground">No data</td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
            <div className="border rounded-md p-4">
               <h3 className="font-semibold mb-2">Top selling products</h3>
               <table className="w-full text-sm">
                  <thead>
                     <tr className="text-left border-b">
                        <th className="py-2">Product</th>
                        <th className="py-2">Brand</th>
                        <th className="py-2">Categories</th>
                        <th className="py-2">Sold</th>
                     </tr>
                  </thead>
                  <tbody>
                     {topProducts.map((row) => (
                        <tr key={row.product?.id} className="border-b last:border-0">
                           <td className="py-2">{row.product?.title}</td>
                           <td className="py-2">{row.product?.brand?.title}</td>
                           <td className="py-2">{row.product?.categories?.map((c) => c.title).join(', ')}</td>
                           <td className="py-2">{row.sold}</td>
                        </tr>
                     ))}
                     {!topProducts.length && (
                        <tr>
                           <td colSpan={4} className="py-4 text-center text-muted-foreground">No data</td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
         </div>
         </TableContainer>
      </ReportsLoadingProvider>
   )
}


