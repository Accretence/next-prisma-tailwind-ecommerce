import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
   try {
      const { searchParams } = new URL(req.url)

      const idsParam = searchParams.get('ids')

      const ids = idsParam ? idsParam.split(',') : []
      const products = await prisma.product.findMany({
         where: {
            id: { in: ids },
         },
         include: {
            crossSellProducts: { include: { brand: true, categories: true } },
         },
      })

      // Merge all cross-sell products and remove duplicates
      const crossSellMap = new Map()
      products.forEach((product) => {
         product.crossSellProducts.forEach((crossSellProduct) => {
            // Exclude products that are in the original ids list
            if (
               !crossSellMap.has(crossSellProduct.id) &&
               !ids.includes(crossSellProduct.id)
            ) {
               crossSellMap.set(crossSellProduct.id, crossSellProduct)
            }
         })
      })

      const uniqueCrossSellProducts = Array.from(crossSellMap.values())

      return NextResponse.json({
         products: uniqueCrossSellProducts,
      })
   } catch (error) {
      console.error('[PRODUCT_CROSS_SELL]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
