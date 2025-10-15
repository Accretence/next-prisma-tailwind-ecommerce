import prisma from '@/lib/prisma'

import { ProductForm } from './components/product-form'

export default async function ProductPage({
   params,
}: {
   params: { productId: string }
}) {
   const product = await prisma.product.findUnique({
      where: {
         id: params.productId,
      },
      include: {
         categories: true,
         brand: true,
        crossSellProducts: true,
      },
   })

   const categories = await prisma.category.findMany()
  const allProducts = await prisma.product.findMany({ select: { id: true, title: true } })

   return (
      <div className="flex-col">
         <div className="flex-1 space-y-4 pt-6 pb-12">
           <ProductForm categories={categories} initialData={product} products={allProducts} />
         </div>
      </div>
   )
}
