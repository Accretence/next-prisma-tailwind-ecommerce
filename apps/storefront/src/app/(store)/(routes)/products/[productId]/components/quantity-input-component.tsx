import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MinusIcon, PlusIcon } from 'lucide-react'
import React from 'react'

export default function QuantityInputComponent({
   quantity,
   setQuantity,
   maxValue,
}) {
   return (
      <>
         <Button
            variant="outline"
            size="icon"
            onClick={() => {
               setQuantity(quantity - 1)
            }}
            disabled={quantity == 1}
         >
            <MinusIcon className="h-4 w-4" />
         </Button>

         <Input
            type="text"
            className="w-16 text-center"
            value={quantity}
            onChange={(e) => {
               if (e.target.value === '') {
                  setQuantity(1)
                  return
               }

               const val = parseInt(e.target.value)

               if (isNaN(val) || val < 1) {
                  setQuantity(1)
                  return
               }

               if (val > maxValue) {
                  setQuantity(maxValue)
                  return
               }

               setQuantity(val)
            }}
         />
         <Button
            variant="outline"
            size="icon"
            onClick={() => {
               setQuantity(quantity + 1)
            }}
            disabled={quantity == maxValue}
         >
            <PlusIcon className="h-4 w-4" />
         </Button>
      </>
   )
}
