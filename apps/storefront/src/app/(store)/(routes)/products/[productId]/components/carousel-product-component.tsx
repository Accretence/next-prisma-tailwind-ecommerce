'use client'

import { Product } from '@/components/native/Product'
import {
   Carousel,
   CarouselContent,
   CarouselItem,
} from '@/components/ui/carousel'
import * as React from 'react'

export function CarouselProductComponent({ crossSellProducts }) {
   return (
      <div>
         <h6 className="text-lg font-semibold">You may also like </h6>
         <p className="opacity-50 text-sm">{crossSellProducts.length} items </p>

         <div className="w-full flex justify-center mt-4">
            <Carousel
               opts={{
                  align: 'start',
               }}
               className="w-full "
            >
               <CarouselContent>
                  {crossSellProducts.map((product) => (
                     <CarouselItem
                        key={product.id}
                        className="md:basis-1/2 lg:basis-1/4"
                     >
                        <Product product={product} key={product.id} />
                     </CarouselItem>
                  ))}
               </CarouselContent>
            </Carousel>
         </div>
      </div>
   )
}
