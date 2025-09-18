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

      // Get current period data
      const currentOrders = await prisma.order.findMany({
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
         }
      })

      // Filter by category and brand if specified
      let filteredOrders = currentOrders
      if (category || brand) {
         filteredOrders = currentOrders.filter(order =>
            order.orderItems.some(item => {
               const product = item.product
               const categoryMatch = !category || product.categories.some(cat => cat.id === category)
               const brandMatch = !brand || product.brandId === brand
               return categoryMatch && brandMatch
            })
         )
      }

      // Calculate current period metrics
      const totalOrders = filteredOrders.length
      const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0)
      const totalProducts = filteredOrders.reduce((sum, order) => 
         sum + order.orderItems.reduce((itemSum, item) => itemSum + item.count, 0), 0
      )
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

      // Calculate previous period for comparison
      const previousStartDate = startDate ? 
         new Date(new Date(startDate).getTime() - (new Date(endDate || new Date()).getTime() - new Date(startDate).getTime())) :
         new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
      const previousEndDate = startDate || new Date()

      const previousOrders = await prisma.order.findMany({
         where: {
            createdAt: {
               gte: previousStartDate,
               lte: previousEndDate
            }
         },
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
         }
      })

      // Filter previous period by category and brand if specified
      let filteredPreviousOrders = previousOrders
      if (category || brand) {
         filteredPreviousOrders = previousOrders.filter(order =>
            order.orderItems.some(item => {
               const product = item.product
               const categoryMatch = !category || product.categories.some(cat => cat.id === category)
               const brandMatch = !brand || product.brandId === brand
               return categoryMatch && brandMatch
            })
         )
      }

      const previousTotalOrders = filteredPreviousOrders.length
      const previousTotalRevenue = filteredPreviousOrders.reduce((sum, order) => sum + order.total, 0)

      // Calculate percentage changes
      const revenueChange = previousTotalRevenue > 0 ? 
         ((totalRevenue - previousTotalRevenue) / previousTotalRevenue) * 100 : 0
      const ordersChange = previousTotalOrders > 0 ? 
         ((totalOrders - previousTotalOrders) / previousTotalOrders) * 100 : 0

      return NextResponse.json({
         totalOrders,
         totalRevenue,
         totalProducts,
         averageOrderValue,
         revenueChange: Math.round(revenueChange * 100) / 100,
         ordersChange: Math.round(ordersChange * 100) / 100
      })

   } catch (error) {
      console.error('Error fetching overview data:', error)
      return NextResponse.json(
         { error: 'Failed to fetch overview data' },
         { status: 500 }
      )
   }
}
