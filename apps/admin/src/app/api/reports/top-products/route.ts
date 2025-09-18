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

      // Aggregate product sales data
      const productSales = new Map<string, {
         id: string
         title: string
         image: string
         brand: { title: string }
         categories: Array<{ title: string }>
         totalSold: number
         totalRevenue: number
         averagePrice: number
      }>()

      filteredOrders.forEach(order => {
         order.orderItems.forEach(item => {
            const product = item.product
            const productId = product.id

            if (!productSales.has(productId)) {
               productSales.set(productId, {
                  id: product.id,
                  title: product.title,
                  image: product.images[0] || '',
                  brand: product.brand,
                  categories: product.categories,
                  totalSold: 0,
                  totalRevenue: 0,
                  averagePrice: 0
               })
            }

            const productData = productSales.get(productId)!
            productData.totalSold += item.count
            productData.totalRevenue += item.price * item.count
         })
      })

      // Calculate average price for each product
      productSales.forEach(productData => {
         productData.averagePrice = productData.totalSold > 0 ? 
            productData.totalRevenue / productData.totalSold : 0
      })

      // Convert to array and sort by total sold
      const topProducts = Array.from(productSales.values())
         .sort((a, b) => b.totalSold - a.totalSold)
         .slice(0, 50) // Top 50 products
         .map((product, index) => ({
            ...product,
            rank: index + 1
         }))

      return NextResponse.json(topProducts)

   } catch (error) {
      console.error('Error fetching top selling products data:', error)
      return NextResponse.json(
         { error: 'Failed to fetch top selling products data' },
         { status: 500 }
      )
   }
}
