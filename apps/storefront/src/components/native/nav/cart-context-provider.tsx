'use client'

import { Button } from '@/components/ui/button'
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from '@/components/ui/popover'
import { ShoppingBasketIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { createContext, useState } from 'react'

export const CartPopupContext = createContext({
   Popup: (item: {
      name: string
      quantity: number
      image: string
      id: string
   }) => {},
   CartComponent: () => null,
})

export default function CartContextProvider({ children }) {
   const [open, setOpen] = useState(false)

   const [toDisplayValue, setToDisplayValue] = useState({
      name: '',
      quantity: 0,
      image: '',
      id: '',
   })

   const Popup = (product) => {
      setOpen(true)

      setToDisplayValue({
         name: product.name,
         quantity: product.quantity,
         image: product.image,
         id: product.id,
      })
      const timer = setTimeout(() => {
         setOpen(false)
      }, 2200)

      // optional if you want to track timer
      return timer
   }

   const CartComponent = () => {
      return (
         <>
            <Popover open={open}>
               <PopoverTrigger asChild>
                  <Link href="/cart">
                     <Button
                        size="icon"
                        variant="outline"
                        className="h-9 relative"
                        onClick={(e) => {
                           e.stopPropagation()
                        }}
                     >
                        <ShoppingBasketIcon className="h-4" />
                     </Button>
                  </Link>
               </PopoverTrigger>

               <PopoverContent className=" p-4 text-sm">
                  <Link href={`/cart`}>
                     <p className="mb-2">Added to Cart Successfully!</p>
                     <div className="flex items-center gap-4">
                        <Image
                           src={toDisplayValue.image}
                           alt={toDisplayValue.name}
                           width={40}
                           height={40}
                           className="mb-2 aspect-square w-auto rounded-md object-cover"
                        />
                        <div>
                           <p className="font-medium text-lg">
                              {toDisplayValue.name}
                           </p>
                           <p className="text-muted-foreground text-md">
                              Quantity: {toDisplayValue.quantity}
                           </p>
                        </div>
                     </div>
                  </Link>
               </PopoverContent>
            </Popover>
         </>
      )
   }

   return (
      <CartPopupContext.Provider value={{ Popup, CartComponent }}>
         {children}
      </CartPopupContext.Provider>
   )
}
