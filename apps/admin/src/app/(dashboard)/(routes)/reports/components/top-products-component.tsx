'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Order, ProductInfo } from '@/types/index'
import '@/types/index'
import Image from 'next/image'
import React from 'react'

export default function TopProductsComponent({ topProducts }) {
   React.useEffect(() => {
      console.log('Top Products:', topProducts)
   }, [topProducts])
   return (
      <Card className="mt-4">
         <CardHeader className="pb-2">
            <h6 className="font-semibold  text-lg ">Top 5 Products</h6>
         </CardHeader>
         <CardContent className="flex flex-col gap-2">
            {topProducts.map((product, index) => (
               <div
                  key={product.id}
                  className=" rounded-md flex gap-2 items-center"
               >
                  {index + 1}.
                  {product.product.images[0] && (
                     <div className="w-[50px] h-[50px] flex-shrink-0">
                        <Image
                           src={product.product.images[0]}
                           alt={product.product.title}
                           className="w-full h-full object-cover rounded"
                           width={50}
                           height={50}
                        />
                     </div>
                  )}
                  <div>
                     <p className="font-semibold">{product.product.title}</p>
                     <p>Units Sold: {product.quantity}</p>
                  </div>
               </div>
            ))}
         </CardContent>
      </Card>
   )
}
