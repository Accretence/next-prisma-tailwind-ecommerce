import { Card, CardContent } from '@/components/ui/card'
import { PaginationComponent } from '@/components/ui/pagination'
import { Order } from '@/types/index'
import { format } from 'date-fns'
import { CalendarFold } from 'lucide-react'
import React from 'react'

import CopyToClipboard from './copy-to-clipboard-component'
import PopoverItemListComponent from './popover-item-list-component'

export default function ReportComponent({ data, pagination }) {
   const groupedOrders = React.useMemo(() => {
      return data.reduce(
         (acc, order) => {
            // Convert ISO date → YYYY-MM-DD
            const date = new Date(order.createdAt).toISOString().split('T')[0]

            if (!acc[date]) {
               acc[date] = []
            }

            acc[date].push(order)
            return acc
         },
         {} as Record<string, Order[]>
      )
   }, [data])

   return (
      <div className="flex-grow overflow-auto pr-2">
         {Object.entries(groupedOrders).map(
            ([date, orders]: [string, Order[]]) => (
               <div key={date}>
                  <div className="mb-4">
                     <div className="flex items-center gap-1">
                        <CalendarFold className="inline-block w-4 h-4" />
                        <h2 className="text-md">
                           {format(new Date(date), 'MMM dd, yyyy')}
                        </h2>
                     </div>
                     <div className="flex gap-4 opacity-60 mt-1">
                        <h3 className="text-sm">
                           Total Order{orders.length !== 1 ? 's' : ''} :{' '}
                           {orders.length}
                        </h3>
                        <h3 className="text-sm">
                           Revenue : $
                           {orders
                              .reduce((acc, order) => acc + order.total, 0)
                              .toFixed(2)}
                        </h3>
                     </div>
                  </div>

                  {orders.map((order) => (
                     <OrderItemComponent key={order.id} order={order} />
                  ))}
               </div>
            )
         )}
         <PaginationComponent
            totalPages={pagination.totalPages}
            currentPage={pagination.currentPage}
         />
      </div>
   )
}

function OrderItemComponent({ order }: { order: Order }) {
   return (
      <Card className="mb-4 overflow-x-hidden">
         <CardContent
            className="p-4 grid  gap-4 "
            style={{
               gridTemplateColumns: '1fr 1fr .3fr .4fr',
            }}
         >
            <div
               className="min-w-[200px]"
               style={{
                  overflow: 'hidden',
               }}
            >
               <div className="flex items-center gap-2">
                  <h6 className="text-lg font-semibold">
                     Order # {order.number}
                  </h6>
                  <ChipStatusComponent status={order.status} />
               </div>
               <div className="flex items-center gap-1">
                  <p className="font-regular truncate">ID : {order.id}</p>
                  <CopyToClipboard text={order.id} />
               </div>
            </div>
            <LabelValueComponent label="Items:">
               <PopoverItemListComponent items={order.orderItems} />
            </LabelValueComponent>
            <LabelValueComponent label="Time:" classname="min-w-[80px]">
               <p className="truncate ">
                  {format(new Date(order.createdAt), 'hh:mm a')}
               </p>
            </LabelValueComponent>
            <LabelValueComponent label="Total:" classname="min-w-[80px]">
               <p className="truncate ">${order.payable.toFixed(2)}</p>
            </LabelValueComponent>
         </CardContent>
      </Card>
   )
}

function LabelValueComponent({
   label,
   children,
   classname,
}: {
   label: string
   children: React.ReactNode
   classname?: string
}) {
   return (
      <div className={`flex flex-col w-full min-w-0 ${classname}`}>
         <span className="font-medium opacity-40 mb-1">{label}</span>
         {children}
      </div>
   )
}

function ChipStatusComponent({ status }: { status: string }) {
   const statusColors: Record<string, string> = {
      Processing: 'bg-[#FFA629]',
      Shipped: 'bg-blue-500',
      Delivered: 'bg-green-500',
      ReturnProcessing: 'bg-yellow-600',
      ReturnCompleted: 'bg-gray-500',
      Cancelled: 'bg-red-500',
      RefundProcessing: 'bg-orange-500',
      RefundCompleted: 'bg-purple-500',
      Denied: 'bg-red-700',
   }
   return (
      <span
         className={`text-white px-2 py-1 rounded-lg text-xs w-fit ${statusColors[status]}`}
      >
         {status}
      </span>
   )
}
