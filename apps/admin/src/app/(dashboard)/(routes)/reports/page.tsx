import { Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ReportsFilters } from './components/reports-filters'
import { OrdersReport } from './components/orders-report'
import { TopSellingProducts } from './components/top-selling-products'
import { ReportsOverview } from './components/reports-overview'

interface ReportsPageProps {
   searchParams: {
      startDate?: string
      endDate?: string
      category?: string
      brand?: string
   }
}

export default function ReportsPage({ searchParams }: ReportsPageProps) {
   return (
      <div className="space-y-6">
         <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
            <p className="text-muted-foreground">
               Analyze orders and track top-selling products with detailed insights.
            </p>
         </div>

         {/* Filters */}
         <Card>
            <CardHeader>
               <CardTitle>Filter Reports</CardTitle>
               <CardDescription>
                  Filter reports by date range, categories, and brands
               </CardDescription>
            </CardHeader>
            <CardContent>
               <Suspense fallback={<div>Loading filters...</div>}>
                  <ReportsFilters />
               </Suspense>
            </CardContent>
         </Card>

         {/* Overview Cards */}
         <Suspense fallback={<div>Loading overview...</div>}>
            <ReportsOverview searchParams={searchParams} />
         </Suspense>

         {/* Orders Report */}
         <Card>
            <CardHeader>
               <CardTitle>Orders Report</CardTitle>
               <CardDescription>
                  Summary of orders grouped by date
               </CardDescription>
            </CardHeader>
            <CardContent>
               <Suspense fallback={<div>Loading orders report...</div>}>
                  <OrdersReport searchParams={searchParams} />
               </Suspense>
            </CardContent>
         </Card>

         {/* Top Selling Products */}
         <Card>
            <CardHeader>
               <CardTitle>Top Selling Products</CardTitle>
               <CardDescription>
                  Most-sold products based on order data
               </CardDescription>
            </CardHeader>
            <CardContent>
               <Suspense fallback={<div>Loading top products...</div>}>
                  <TopSellingProducts searchParams={searchParams} />
               </Suspense>
            </CardContent>
         </Card>
      </div>
   )
}
