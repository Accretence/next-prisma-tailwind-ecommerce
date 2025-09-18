import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function ReportsLoading() {
   return (
      <div className="space-y-6">
         <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-96" />
         </div>

         {/* Filters Loading */}
         <Card>
            <CardHeader>
               <Skeleton className="h-6 w-32" />
               <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
               </div>
            </CardContent>
         </Card>

         {/* Overview Cards Loading */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
               <Card key={i}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                     <Skeleton className="h-4 w-24" />
                     <Skeleton className="h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                     <Skeleton className="h-8 w-20 mb-2" />
                     <Skeleton className="h-3 w-32" />
                  </CardContent>
               </Card>
            ))}
         </div>

         {/* Orders Report Loading */}
         <Card>
            <CardHeader>
               <Skeleton className="h-6 w-32" />
               <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     {Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i}>
                           <CardHeader className="pb-2">
                              <Skeleton className="h-4 w-24" />
                           </CardHeader>
                           <CardContent>
                              <Skeleton className="h-8 w-20" />
                           </CardContent>
                        </Card>
                     ))}
                  </div>
                  <div className="rounded-md border">
                     <div className="p-4">
                        <Skeleton className="h-10 w-full mb-4" />
                        {Array.from({ length: 5 }).map((_, i) => (
                           <Skeleton key={i} className="h-12 w-full mb-2" />
                        ))}
                     </div>
                  </div>
               </div>
            </CardContent>
         </Card>

         {/* Top Products Loading */}
         <Card>
            <CardHeader>
               <Skeleton className="h-6 w-40" />
               <Skeleton className="h-4 w-56" />
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     {Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i}>
                           <CardHeader className="pb-2">
                              <Skeleton className="h-4 w-24" />
                           </CardHeader>
                           <CardContent>
                              <Skeleton className="h-8 w-20" />
                           </CardContent>
                        </Card>
                     ))}
                  </div>
                  <div className="rounded-md border">
                     <div className="p-4">
                        <Skeleton className="h-10 w-full mb-4" />
                        {Array.from({ length: 5 }).map((_, i) => (
                           <Skeleton key={i} className="h-16 w-full mb-2" />
                        ))}
                     </div>
                  </div>
               </div>
            </CardContent>
         </Card>
      </div>
   )
}
