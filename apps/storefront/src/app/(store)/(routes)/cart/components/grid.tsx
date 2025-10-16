'use client'

import { Card, CardContent } from '@/components/ui/card'
import { isVariableValid } from '@/lib/utils'
import { useCartContext } from '@/state/Cart'

import { Item } from './item'
import { Receipt } from './receipt'
import { Skeleton } from './skeleton'
import { Separator } from '@/components/ui/separator'
import { CrossSellProducts } from '../../products/[productId]/components/cross_sell_product'

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

   const crossSellProductsMerge = () => {
      const mergedCrossSellProducts = new Map();

      if (isVariableValid(cart?.items) && cart.items.length) {
         for (const item of cart.items) {
            const crossSellProducts = item?.product?.crossSellOf;
            if (Array.isArray(crossSellProducts)) {
               for (const product of crossSellProducts) {
                  if (product?.id && !mergedCrossSellProducts.has(product.id)) {
                     mergedCrossSellProducts.set(product.id, product);
                  }
               }
            }
         }
      }

      return Array.from(mergedCrossSellProducts.values());
   };

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
            <h2 className="my-4 text-xl font-medium tracking-tight">You might also like:</h2>
            <CrossSellProducts products={crossSellProductsMerge()} />
         </div>
      </>
   )
}
