'use client'

import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { isVariableValid } from '@/lib/utils'
import { useCartContext } from '@/state/Cart'

import { Item } from './item'
import { Receipt } from './receipt'
import { Skeleton } from './skeleton'

export const CartGrid = async () => {
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

   // Fetch cross-sell products for items in cart
   const productIds = (cart?.items || []).map((it) => it.product?.id || it.productId).filter(Boolean)
   const crossSells = productIds.length
      ? await prisma.product.findMany({
           where: { id: { in: productIds } },
           include: { crossSellProducts: { select: { id: true, title: true, images: true } } },
        })
      : []

   const suggested = Array.from(new Map(
      crossSells.flatMap((p) => p.crossSellProducts).map((p) => [p.id, p])
   ).values())

   return (
      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
         <div className="md:col-span-2">
            {isVariableValid(cart?.items)
               ? cart?.items?.map((cartItem, index) => (
                    <Item cartItem={cartItem} key={index} />
                 ))
               : [...Array(5)].map((cartItem, index) => (
                    <Skeleton key={index} />
                 ))}

            {suggested.length > 0 && (
               <div className="mt-6">
                  <h3 className="mb-3 text-lg font-medium">You might also like</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                     {suggested.map((p) => (
                        <Link key={p.id} href={`/products/${p.id}`} className="block rounded border hover:shadow-sm transition">
                           <div className="relative h-32 w-full">
                              <img src={p.images?.[0]} alt={p.title} className="h-32 w-full object-cover rounded-t" />
                           </div>
                           <div className="p-2 text-sm font-medium line-clamp-1">{p.title}</div>
                        </Link>
                     ))}
                  </div>
               </div>
            )}
         </div>
         <Receipt />
      </div>
   )
}
