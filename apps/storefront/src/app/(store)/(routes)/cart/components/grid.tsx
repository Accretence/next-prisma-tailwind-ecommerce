'use client'

import { Card, CardContent } from '@/components/ui/card'
import { isVariableValid } from '@/lib/utils'
import { useCartContext } from '@/state/Cart'

import { Item } from './item'
import { Receipt } from './receipt'
import { Skeleton } from './skeleton'
import { RelatedProducts } from "../../products/[productId]/components/related_product"
import { Separator } from "@/components/native/separator"

export const CartGrid = () => {
   const { loading, cart, refreshCart, dispatchCart } = useCartContext()

   if (isVariableValid(cart?.items) && cart?.items?.length === 0) {
      return (
         <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
               <Card>
                  <CardContent className="p-4">
                     <p>Your Cart is empty...</p>
                  </CardContent>
               </Card>
            </div>
            <Receipt />
         </div>
      )
   }

   const relatedProducts = () => {
      const mergedCrossSellProducts = []

      if (isVariableValid(cart?.items) && cart?.items?.length) {
         return [
            ...new Map(
               cart.items
                  .flatMap(item => item?.product?.crossSellProducts ?? [])
                  .map(product => [product.id, product]) // use id as key
            ).values(),
         ]
      }

      return mergedCrossSellProducts
   }

   return (
      <>
         <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
               {isVariableValid(cart?.items)
                  ? cart?.items?.map((cartItem, index) => (
                     <Item cartItem={cartItem} key={index} />
                  ))
                  : [...Array(5)].map((cartItem, index) => (
                     <Skeleton key={index} />
                  ))}
            </div>
            <Receipt />
         </div>
         <Separator />
         <div>
            <h2 className="mb-4 text-xl font-bold tracking-tight">You might also like</h2>
            <RelatedProducts products={relatedProducts()} />
         </div>
      </>
   )
}
