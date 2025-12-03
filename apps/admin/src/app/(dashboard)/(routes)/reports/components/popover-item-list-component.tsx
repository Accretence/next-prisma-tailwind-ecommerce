import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from '@/components/ui/popover'
import React from 'react'

export default function PopoverItemListComponent({ items }) {
   const text = items
      .map((item) => `${item.count} x ${item.product.title}`)
      .join(', ')

   return (
      <Popover>
         <PopoverTrigger className=" w-full text-left truncate">
            <p className="truncate">{text}</p>
         </PopoverTrigger>

         <PopoverContent>
            <ul className="max-h-60 overflow-y-auto">
               {items.map((item, index) => (
                  <li key={index} className="py-1 flex justify-between">
                     <p>{item.product.title}</p>
                     <p>x{item.count}</p>
                  </li>
               ))}
            </ul>
         </PopoverContent>
      </Popover>
   )
}
