import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { format } from 'date-fns'
import { ChevronsRight, Coins, ScrollText } from 'lucide-react'
import React from 'react'

export default function ChartComponent({
   orderCount = 0,
   startDate,
   endDate,
   totalRevenue,
}: {
   orderCount: number
   startDate: string
   endDate: string
   totalRevenue: number
}) {
   return (
      <Card className="p-4 ">
         {(startDate || endDate) && (
            <>
               <CardHeader className="p-0 opacity-50 flex flex-row justify-between items-center text-sm gap-1 ">
                  <div className="flex flex-col">
                     <p className="opacity-80">Start Date:</p>
                     <p>
                        {startDate
                           ? format(new Date(startDate), 'MMM dd, yyyy')
                           : 'All Time'}
                     </p>
                  </div>
                  <ChevronsRight className="flex-shrink-0" />
                  <div className="flex flex-col translate-y-[-2px]">
                     <p className="opacity-80">End Date:</p>
                     <p>
                        {endDate
                           ? format(new Date(endDate), 'MMM dd, yyyy')
                           : 'Present'}
                     </p>
                  </div>
               </CardHeader>
               <Separator className="my-2" />
            </>
         )}
         <CardContent className="p-0 grid grid-cols-2 gap-5">
            <TitleValueCard
               title="Total Revenue"
               value={`$${totalRevenue.toFixed(2)}`}
               icon={<Coins className="w-4 h-4 mr-2 opacity-70" />}
            />
            <TitleValueCard
               title="Total Orders"
               value={orderCount.toString()}
               icon={<ScrollText className="w-4 h-4 mr-2 opacity-70" />}
            />
         </CardContent>
      </Card>
   )
}

function TitleValueCard({
   title,
   value,
   icon,
}: {
   title: string
   value: string
   icon: React.ReactNode
}) {
   return (
      <div>
         <div className="flex items-center mb-2 ">
            {icon}
            <p>{title}</p>
         </div>
         <h2 className="text-2xl font-bold">{value}</h2>
      </div>
   )
}
