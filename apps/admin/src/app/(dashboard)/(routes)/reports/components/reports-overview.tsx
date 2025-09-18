import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package } from 'lucide-react'

interface ReportsOverviewProps {
   searchParams: {
      startDate?: string
      endDate?: string
      category?: string
      brand?: string
   }
}

interface OverviewData {
   totalOrders: number
   totalRevenue: number
   totalProducts: number
   averageOrderValue: number
   revenueChange: number
   ordersChange: number
}

async function getOverviewData(searchParams: ReportsOverviewProps['searchParams']): Promise<OverviewData> {
   const params = new URLSearchParams()
   
   if (searchParams.startDate) params.set('startDate', searchParams.startDate)
   if (searchParams.endDate) params.set('endDate', searchParams.endDate)
   if (searchParams.category) params.set('category', searchParams.category)
   if (searchParams.brand) params.set('brand', searchParams.brand)

   try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:8888'}/api/reports/overview?${params.toString()}`, {
         cache: 'no-store'
      })
      
      if (!response.ok) {
         throw new Error('Failed to fetch overview data')
      }
      
      return await response.json()
   } catch (error) {
      console.error('Error fetching overview data:', error)
      return {
         totalOrders: 0,
         totalRevenue: 0,
         totalProducts: 0,
         averageOrderValue: 0,
         revenueChange: 0,
         ordersChange: 0
      }
   }
}

export async function ReportsOverview({ searchParams }: ReportsOverviewProps) {
   const data = await getOverviewData(searchParams)

   return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         {/* Total Revenue */}
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
               <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">${data.totalRevenue.toLocaleString()}</div>
               <div className="flex items-center text-xs text-muted-foreground">
                  {data.revenueChange >= 0 ? (
                     <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                     <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  <span className={data.revenueChange >= 0 ? 'text-green-500' : 'text-red-500'}>
                     {Math.abs(data.revenueChange)}%
                  </span>
                  <span className="ml-1">from last period</span>
               </div>
            </CardContent>
         </Card>

         {/* Total Orders */}
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
               <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">{data.totalOrders.toLocaleString()}</div>
               <div className="flex items-center text-xs text-muted-foreground">
                  {data.ordersChange >= 0 ? (
                     <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                     <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  <span className={data.ordersChange >= 0 ? 'text-green-500' : 'text-red-500'}>
                     {Math.abs(data.ordersChange)}%
                  </span>
                  <span className="ml-1">from last period</span>
               </div>
            </CardContent>
         </Card>

         {/* Average Order Value */}
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
               <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">${data.averageOrderValue.toFixed(2)}</div>
               <p className="text-xs text-muted-foreground">
                  Per order
               </p>
            </CardContent>
         </Card>

         {/* Total Products Sold */}
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">Products Sold</CardTitle>
               <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">{data.totalProducts.toLocaleString()}</div>
               <p className="text-xs text-muted-foreground">
                  Total units sold
               </p>
            </CardContent>
         </Card>
      </div>
   )
}
