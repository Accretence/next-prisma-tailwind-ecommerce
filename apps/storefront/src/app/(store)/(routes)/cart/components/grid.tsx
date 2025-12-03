'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { isVariableValid } from '@/lib/utils'
import { useCartContext } from '@/state/Cart'
import { useEffect, useState } from 'react'

import { CarouselProductComponent } from '../../products/[productId]/components/carousel-product-component'
import { Item } from './item'
import { Receipt } from './receipt'
import { Skeleton } from './skeleton'

export const CartGrid = () => {
   const { cart } = useCartContext()

   const [crossSellProducts, setCrossSellProducts] = useState([])
   useEffect(() => {
      if (cart?.items.length > 0) {
         handleGetCrossSellProducts()
      }
   }, [cart?.items])

   const handleGetCrossSellProducts = async () => {
      try {
         const productIds = cart?.items?.map((item: any) => item.productId)

         if (!productIds || productIds.length === 0) {
            return []
         }

         const query = encodeURIComponent(productIds.join(','))
         const response = await fetch(`/api/products/crosssell?ids=${query}`, {
            method: 'GET',
            cache: 'no-store',
         })

         const data = await response.json()
         setCrossSellProducts(data.products)

         if (!response.ok) {
            throw new Error(`Request failed: ${response.status}`)
         }

         return await response.json()
      } catch (error) {
         console.error(error)
         return []
      }
   }

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

   return (
      <div>
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
         <Separator className="my-4" />
         <div>
            {crossSellProducts.length > 0 && (
               <CarouselProductComponent
                  crossSellProducts={crossSellProducts}
               />
            )}
         </div>
      </div>
   )
}
