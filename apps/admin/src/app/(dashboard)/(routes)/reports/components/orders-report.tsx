import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { format } from 'date-fns'

interface OrdersReportProps {
   searchParams: {
      startDate?: string
      endDate?: string
      category?: string
      brand?: string
   }
}

interface OrderReportData {
   date: string
   ordersCount: number
   totalRevenue: number
   averageOrderValue: number
   statusBreakdown: {
      Processing: number
      Shipped: number
      Delivered: number
      Cancelled: number
      [key: string]: number
   }
}

async function getOrdersReportData(searchParams: OrdersReportProps['searchParams']): Promise<OrderReportData[]> {
   const params = new URLSearchParams()
   
   if (searchParams.startDate) params.set('startDate', searchParams.startDate)
   if (searchParams.endDate) params.set('endDate', searchParams.endDate)
   if (searchParams.category) params.set('category', searchParams.category)
   if (searchParams.brand) params.set('brand', searchParams.brand)

   try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:8888'}/api/reports/orders?${params.toString()}`, {
         cache: 'no-store'
      })
      
      if (!response.ok) {
         throw new Error('Failed to fetch orders report data')
      }
      
      return await response.json()
   } catch (error) {
      console.error('Error fetching orders report data:', error)
      return []
   }
}

const statusColors = {
   Processing: 'bg-yellow-100 text-yellow-800',
   Shipped: 'bg-blue-100 text-blue-800',
   Delivered: 'bg-green-100 text-green-800',
   Cancelled: 'bg-red-100 text-red-800',
   ReturnProcessing: 'bg-orange-100 text-orange-800',
   ReturnCompleted: 'bg-gray-100 text-gray-800',
   RefundProcessing: 'bg-purple-100 text-purple-800',
   RefundCompleted: 'bg-gray-100 text-gray-800',
   Denied: 'bg-red-100 text-red-800'
}

export async function OrdersReport({ searchParams }: OrdersReportProps) {
   const data = await getOrdersReportData(searchParams)

   if (data.length === 0) {
      return (
         <div className="text-center py-8">
            <p className="text-muted-foreground">No orders found for the selected filters.</p>
         </div>
      )
   }

   return (
      <div className="space-y-4">
         {/* Summary Cards */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
               <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold">
                     {data.reduce((sum, day) => sum + day.ordersCount, 0).toLocaleString()}
                  </div>
               </CardContent>
            </Card>
            
            <Card>
               <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold">
                     ${data.reduce((sum, day) => sum + day.totalRevenue, 0).toLocaleString()}
                  </div>
               </CardContent>
            </Card>
            
            <Card>
               <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold">
                     ${(data.reduce((sum, day) => sum + day.totalRevenue, 0) / data.reduce((sum, day) => sum + day.ordersCount, 0) || 0).toFixed(2)}
                  </div>
               </CardContent>
            </Card>
         </div>

         {/* Orders Table */}
         <div className="rounded-md border">
            <Table>
               <TableHeader>
                  <TableRow>
                     <TableHead>Date</TableHead>
                     <TableHead>Orders</TableHead>
                     <TableHead>Revenue</TableHead>
                     <TableHead>Avg Order Value</TableHead>
                     <TableHead>Status Breakdown</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {data.map((day) => (
                     <TableRow key={day.date}>
                        <TableCell className="font-medium">
                           {format(new Date(day.date), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell>{day.ordersCount.toLocaleString()}</TableCell>
                        <TableCell>${day.totalRevenue.toLocaleString()}</TableCell>
                        <TableCell>${day.averageOrderValue.toFixed(2)}</TableCell>
                        <TableCell>
                           <div className="flex flex-wrap gap-1">
                              {Object.entries(day.statusBreakdown)
                                 .filter(([_, count]) => count > 0)
                                 .map(([status, count]) => (
                                    <Badge
                                       key={status}
                                       variant="secondary"
                                       className={statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}
                                    >
                                       {status}: {count}
                                    </Badge>
                                 ))}
                           </div>
                        </TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </div>
      </div>
   )
}
