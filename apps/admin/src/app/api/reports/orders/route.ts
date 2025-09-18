import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
   try {
      const { searchParams } = new URL(request.url)
      const startDate = searchParams.get('startDate')
      const endDate = searchParams.get('endDate')
      const category = searchParams.get('category')
      const brand = searchParams.get('brand')

      // Build date filter
      const dateFilter: any = {}
      if (startDate) {
         dateFilter.gte = new Date(startDate)
      }
      if (endDate) {
         dateFilter.lte = new Date(endDate)
      }

      // Build where clause for orders
      const whereClause: any = {}
      if (Object.keys(dateFilter).length > 0) {
         whereClause.createdAt = dateFilter
      }

      // Get orders with order items and product details
      const orders = await prisma.order.findMany({
         where: whereClause,
         include: {
            orderItems: {
               include: {
                  product: {
                     include: {
                        brand: true,
                        categories: true
                     }
                  }
               }
            }
         },
         orderBy: {
            createdAt: 'asc'
         }
      })

      // Filter by category and brand if specified
      let filteredOrders = orders
      if (category || brand) {
         filteredOrders = orders.filter(order =>
            order.orderItems.some(item => {
               const product = item.product
               const categoryMatch = !category || product.categories.some(cat => cat.id === category)
               const brandMatch = !brand || product.brandId === brand
               return categoryMatch && brandMatch
            })
         )
      }

      // Group orders by date
      const ordersByDate = new Map<string, typeof filteredOrders>()

      filteredOrders.forEach(order => {
         const dateKey = order.createdAt.toISOString().split('T')[0]
         if (!ordersByDate.has(dateKey)) {
            ordersByDate.set(dateKey, [])
         }
         ordersByDate.get(dateKey)!.push(order)
      })

      // Convert to report format
      const reportData = Array.from(ordersByDate.entries()).map(([date, dayOrders]) => {
         const ordersCount = dayOrders.length
         const totalRevenue = dayOrders.reduce((sum, order) => sum + order.total, 0)
         const averageOrderValue = ordersCount > 0 ? totalRevenue / ordersCount : 0

         // Calculate status breakdown
         const statusBreakdown = dayOrders.reduce((acc, order) => {
            acc[order.status] = (acc[order.status] || 0) + 1
            return acc
         }, {} as Record<string, number>)

         return {
            date,
            ordersCount,
            totalRevenue,
            averageOrderValue,
            statusBreakdown
         }
      })

      // Sort by date
      reportData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

      return NextResponse.json(reportData)

   } catch (error) {
      console.error('Error fetching orders report data:', error)
      return NextResponse.json(
         { error: 'Failed to fetch orders report data' },
         { status: 500 }
      )
   }
}
