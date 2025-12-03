import Carousel from '@/components/native/Carousel'
import { Separator } from '@/components/ui/separator'
import prisma from '@/lib/prisma'
import { isVariableValid } from '@/lib/utils'
import { ChevronRightIcon } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { CarouselProductComponent } from './components/carousel-product-component'
import { DataSection } from './components/data'

type Props = {
   params: { productId: string }
   searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
   const product = await prisma.product.findUnique({
      where: {
         id: params.productId,
      },
   })

   if (!product) {
      return {
         title: 'Product Not Found',
      }
   }

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
         crossSellProducts: {
            include: { brand: true, categories: true },
         },
         crossSellOf: {
            include: { brand: true, categories: true },
         },
      },
   })

   if (isVariableValid(product)) {
      return (
         <>
            <Breadcrumbs product={product} />
            <div className="mt-6 grid grid-cols-1 md:gap-4 md:grid-cols-3">
               <ImageColumn product={product} />
               <DataSection product={product} />
            </div>
            {product.crossSellProducts.length > 0 ? (
               <>
                  <Separator className="my-6" />
                  <CarouselProductComponent
                     crossSellProducts={product.crossSellProducts}
                  />
               </>
            ) : null}
         </>
      )
   }
}

const ImageColumn = ({ product }) => {
   return (
      <div className="relative  w-full col-span-1">
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
