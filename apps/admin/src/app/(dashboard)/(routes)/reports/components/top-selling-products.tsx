import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Image } from '@/components/ui/image'
import { TrendingUp, Package, DollarSign } from 'lucide-react'

interface TopSellingProductsProps {
   searchParams: {
      startDate?: string
      endDate?: string
      category?: string
      brand?: string
   }
}

interface TopSellingProduct {
   id: string
   title: string
   image: string
   brand: {
      title: string
   }
   categories: Array<{
      title: string
   }>
   totalSold: number
   totalRevenue: number
   averagePrice: number
   rank: number
   previousRank?: number
}

async function getTopSellingProducts(searchParams: TopSellingProductsProps['searchParams']): Promise<TopSellingProduct[]> {
   const params = new URLSearchParams()
   
   if (searchParams.startDate) params.set('startDate', searchParams.startDate)
   if (searchParams.endDate) params.set('endDate', searchParams.endDate)
   if (searchParams.category) params.set('category', searchParams.category)
   if (searchParams.brand) params.set('brand', searchParams.brand)

   try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:8888'}/api/reports/top-products?${params.toString()}`, {
         cache: 'no-store'
      })
      
      if (!response.ok) {
         throw new Error('Failed to fetch top selling products data')
      }
      
      return await response.json()
   } catch (error) {
      console.error('Error fetching top selling products data:', error)
      return []
   }
}

export async function TopSellingProducts({ searchParams }: TopSellingProductsProps) {
   const products = await getTopSellingProducts(searchParams)

   if (products.length === 0) {
      return (
         <div className="text-center py-8">
            <p className="text-muted-foreground">No products found for the selected filters.</p>
         </div>
      )
   }

   return (
      <div className="space-y-4">
         {/* Summary Stats */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
               <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                     <Package className="h-4 w-4 mr-2" />
                     Total Products Sold
                  </CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold">
                     {products.reduce((sum, product) => sum + product.totalSold, 0).toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">units across all products</p>
               </CardContent>
            </Card>
            
            <Card>
               <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                     <DollarSign className="h-4 w-4 mr-2" />
                     Total Revenue
                  </CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold">
                     ${products.reduce((sum, product) => sum + product.totalRevenue, 0).toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">from top products</p>
               </CardContent>
            </Card>
            
            <Card>
               <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                     <TrendingUp className="h-4 w-4 mr-2" />
                     Top Performer
                  </CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="text-lg font-bold truncate">
                     {products[0]?.title || 'N/A'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                     {products[0]?.totalSold || 0} units sold
                  </p>
               </CardContent>
            </Card>
         </div>

         {/* Top Products Table */}
         <div className="rounded-md border">
            <Table>
               <TableHeader>
                  <TableRow>
                     <TableHead className="w-12">Rank</TableHead>
                     <TableHead className="w-16">Image</TableHead>
                     <TableHead>Product</TableHead>
                     <TableHead>Brand</TableHead>
                     <TableHead>Categories</TableHead>
                     <TableHead className="text-right">Units Sold</TableHead>
                     <TableHead className="text-right">Revenue</TableHead>
                     <TableHead className="text-right">Avg Price</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {products.map((product, index) => (
                     <TableRow key={product.id}>
                        <TableCell>
                           <div className="flex items-center">
                              <span className="font-bold text-lg">#{index + 1}</span>
                              {product.previousRank && product.previousRank !== index + 1 && (
                                 <div className="ml-2">
                                    {product.previousRank > index + 1 ? (
                                       <TrendingUp className="h-4 w-4 text-green-500" />
                                    ) : (
                                       <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
                                    )}
                                 </div>
                              )}
                           </div>
                        </TableCell>
                        <TableCell>
                           <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100">
                              {product.image ? (
                                 <img
                                    src={product.image}
                                    alt={product.title}
                                    className="w-full h-full object-cover"
                                 />
                              ) : (
                                 <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <Package className="h-6 w-6" />
                                 </div>
                              )}
                           </div>
                        </TableCell>
                        <TableCell>
                           <div>
                              <div className="font-medium truncate max-w-[200px]">
                                 {product.title}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                 ID: {product.id.slice(-8)}
                              </div>
                           </div>
                        </TableCell>
                        <TableCell>
                           <Badge variant="outline">
                              {product.brand.title}
                           </Badge>
                        </TableCell>
                        <TableCell>
                           <div className="flex flex-wrap gap-1">
                              {product.categories.slice(0, 2).map((category) => (
                                 <Badge key={category.title} variant="secondary" className="text-xs">
                                    {category.title}
                                 </Badge>
                              ))}
                              {product.categories.length > 2 && (
                                 <Badge variant="secondary" className="text-xs">
                                    +{product.categories.length - 2} more
                                 </Badge>
                              )}
                           </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                           {product.totalSold.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                           ${product.totalRevenue.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                           ${product.averagePrice.toFixed(2)}
                        </TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </div>

         {/* Additional Info */}
         <div className="text-sm text-muted-foreground">
            <p>
               Showing top {products.length} products based on total units sold. 
               Rankings are calculated from the selected date range and filters.
            </p>
         </div>
      </div>
   )
}
