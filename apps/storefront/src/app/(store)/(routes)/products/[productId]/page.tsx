import Carousel from '@/components/native/Carousel'
import prisma from '@/lib/prisma'
import { isVariableValid } from '@/lib/utils'
import { ChevronRightIcon } from 'lucide-react'
import type { Metadata, ResolvingMetadata } from 'next'
import Link from 'next/link'

import { DataSection } from './components/data'

type Props = {
   params: { productId: string }
   searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
   { params, searchParams }: Props,
   parent: ResolvingMetadata
): Promise<Metadata> {
   const product = await prisma.product.findUnique({
      where: {
         id: params.productId,
      },
   })

   return {
      title: product.title,
      description: product.description,
      keywords: product.keywords,
      openGraph: {
         images: product.images,
      },
   }
}

export default async function Product({
   params,
}: {
   params: { productId: string }
}) {
   const product = await prisma.product.findUnique({
      where: {
         id: params.productId,
      },
      include: {
         brand: true,
         categories: true,
         crossSellProducts: { include: { brand: true, categories: true } },
      },
   })

   if (isVariableValid(product)) {
      return (
         <>
            <Breadcrumbs product={product} />
            <div className="mt-6 grid grid-cols-1 gap-2 md:grid-cols-3">
               <ImageColumn product={product} />
               <DataSection product={product} />
            </div>
            {isVariableValid(product.crossSellProducts) && product.crossSellProducts.length > 0 && (
               <div className="mt-8">
                  <h3 className="mb-3 text-lg font-medium">You might also like</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                     {product.crossSellProducts.map((p) => (
                        <Link key={p.id} href={`/products/${p.id}`} className="block rounded border hover:shadow-sm transition">
                           <div className="relative h-40 w-full">
                              {/* fallback first image */}
                              <img src={p.images?.[0]} alt={p.title} className="h-40 w-full object-cover rounded-t" />
                           </div>
                           <div className="p-2">
                              <div className="text-sm font-medium line-clamp-1">{p.title}</div>
                              <div className="text-xs text-neutral-500">{p.brand?.title}</div>
                           </div>
                        </Link>
                     ))}
                  </div>
               </div>
            )}
         </>
      )
   }
}

const ImageColumn = ({ product }) => {
   return (
      <div className="relative min-h-[50vh] w-full col-span-1">
         <Carousel images={product?.images} />
      </div>
   )
}

const Breadcrumbs = ({ product }) => {
   return (
      <nav className="flex text-muted-foreground" aria-label="Breadcrumb">
         <ol className="inline-flex items-center gap-2">
            <li className="inline-flex items-center">
               <Link
                  href="/"
                  className="inline-flex items-center text-sm font-medium"
               >
                  Home
               </Link>
            </li>
            <li>
               <div className="flex items-center gap-2">
                  <ChevronRightIcon className="h-4" />
                  <Link className="text-sm font-medium" href="/products">
                     Products
                  </Link>
               </div>
            </li>
            <li aria-current="page">
               <div className="flex items-center gap-2">
                  <ChevronRightIcon className="h-4" />
                  <span className="text-sm font-medium">{product?.title}</span>
               </div>
            </li>
         </ol>
      </nav>
   )
}
