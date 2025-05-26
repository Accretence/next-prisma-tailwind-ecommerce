import { Badge } from '@/components/ui/badge'
import { Product } from '@prisma/client'
import Link from 'next/link'

interface CrossSellProductsProps {
   products: Product[]
}

export function CrossSellProducts({ products }: CrossSellProductsProps) {
   function Price({ product }: { product: Product }) {
      if (product?.discount > 0) {
         const price = product?.price - product?.discount
         const percentage = (product?.discount / product?.price) * 100
         return (
            <div className="flex gap-2 items-center">
               <Badge className="flex gap-4" variant="destructive">
                  <div className="line-through">${product?.price}</div>
                  <div>%{percentage.toFixed(2)}</div>
               </Badge>
               <h2 className="">${price.toFixed(2)}</h2>
            </div>
         )
      }

      return <h2>${product?.price}</h2>
   }
   
   return (
      <div className="mt-12">
         <h2 className="text-2xl font-semibold mb-4">You might also like</h2>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {products.map((product) => (
               <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="block border rounded-lg overflow-hidden hover:shadow-lg transition"
               >
                  <img
                     src={product.images[0]}
                     alt={product.title}
                     className="w-full h-40 object-cover"
                  />

                  <div className="p-2">
                     <h3 className="text-lg font-semibold">{product.title}</h3>
                     <p className="text-sm text-gray-600">
                        {product.description}
                     </p>
                     <div className="text-green-600 font-bold mt-2">
                        {product.isAvailable ? (
                           <Price product={product} />
                        ) : (
                           <Badge variant="secondary">
                              Out of Stock
                           </Badge>
                        )}
                     </div>
                  </div>
               </Link>
            ))}
         </div>
      </div>
   )
}
