import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { addCrossSellProducts, removeCrossSellProducts, setCrossSellProducts, getCrossSellProducts } from '@/lib/cross-sell'

// GET - Get cross-sell products for a product
export async function GET(
   request: NextRequest,
   { params }: { params: { productId: string } }
) {
   try {
      const { productId } = params
      const { searchParams } = new URL(request.url)
      const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined

      const Product_A = await getCrossSellProducts(productId, limit)

      return NextResponse.json(Product_A)
   } catch (error) {
      console.error('[GET_CROSS_SELL_PRODUCTS]', error)
      return NextResponse.json(
         { error: 'Failed to fetch cross-sell products' },
         { status: 500 }
      )
   }
}

// POST - Add cross-sell products to a product
export async function POST(
   request: NextRequest,
   { params }: { params: { productId: string } }
) {
   try {
      const { productId } = params
      const { crossSellProductIds } = await request.json()

      if (!Array.isArray(crossSellProductIds)) {
         return NextResponse.json(
            { error: 'crossSellProductIds must be an array' },
            { status: 400 }
         )
      }

      const product = await addCrossSellProducts(productId, crossSellProductIds)

      return NextResponse.json(product)
   } catch (error) {
      console.error('[ADD_CROSS_SELL_PRODUCTS]', error)
      return NextResponse.json(
         { error: 'Failed to add cross-sell products' },
         { status: 500 }
      )
   }
}

// PUT - Set cross-sell products for a product (replaces existing ones)
export async function PUT(
   request: NextRequest,
   { params }: { params: { productId: string } }
) {
   try {
      const { productId } = params
      const { crossSellProductIds } = await request.json()

      if (!Array.isArray(crossSellProductIds)) {
         return NextResponse.json(
            { error: 'crossSellProductIds must be an array' },
            { status: 400 }
         )
      }

      const product = await setCrossSellProducts(productId, crossSellProductIds)

      return NextResponse.json(product)
   } catch (error) {
      console.error('[SET_CROSS_SELL_PRODUCTS]', error)
      return NextResponse.json(
         { error: 'Failed to set cross-sell products' },
         { status: 500 }
      )
   }
}

// DELETE - Remove cross-sell products from a product
export async function DELETE(
   request: NextRequest,
   { params }: { params: { productId: string } }
) {
   try {
      const { productId } = params
      const { searchParams } = new URL(request.url)
      const crossSellProductIds = searchParams.get('productIds')?.split(',')

      if (!crossSellProductIds || crossSellProductIds.length === 0) {
         return NextResponse.json(
            { error: 'productIds query parameter is required' },
            { status: 400 }
         )
      }

      const product = await removeCrossSellProducts(productId, crossSellProductIds)

      return NextResponse.json(product)
   } catch (error) {
      console.error('[REMOVE_CROSS_SELL_PRODUCTS]', error)
      return NextResponse.json(
         { error: 'Failed to remove cross-sell products' },
         { status: 500 }
      )
   }
}
