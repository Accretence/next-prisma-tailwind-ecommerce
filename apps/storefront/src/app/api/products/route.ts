import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
   try {
      const { searchParams } = new URL(req.url)

      const search = searchParams.get('search') || ''
      const brand = searchParams.get('brand') || undefined
      const category = searchParams.get('category') || null
      const page = Number(searchParams.get('page') || 1)
      const minPrice = searchParams.get('minPrice')
      const maxPrice = searchParams.get('maxPrice')
      const isAvailable = searchParams.get('isAvailable')
      const sort = searchParams.get('sort') // optional

      // Split category to ["cat1", "cat2"]
      const categoryList = category ? category.split('+').filter(Boolean) : null

      // Build WHERE clause once
      const where = {
         title: {
            contains: search,
            mode: 'insensitive' as const,
         },
         isAvailable: isAvailable == 'true' || sort ? true : undefined,
         brand: {
            id: brand || undefined,
         },
         price: {
            gte: minPrice ? Number(minPrice) : undefined,
            lte: maxPrice ? Number(maxPrice) : undefined,
         },
         categories: categoryList
            ? {
                 some: {
                    OR: categoryList.map((c) => ({
                       title: {
                          contains: c,
                          mode: 'insensitive' as const,
                       },
                    })),
                 },
              }
            : undefined,
      }

      const pageSize = 12

      // Fetch products + total count in parallel
      const [products, totalItems] = await Promise.all([
         prisma.product.findMany({
            where,
            skip: (page - 1) * pageSize,
            take: pageSize,
            include: {
               brand: true,
               categories: true,
            },
         }),
         prisma.product.count({ where }),
      ])

      const totalPages = Math.ceil(totalItems / pageSize)
      const pagesLeft = Math.max(totalPages - page, 0)

      return NextResponse.json({
         products,
         totalItems,
         totalPages,
         pagesLeft,
         currentPage: page,
      })
   } catch (error) {
      console.error('[PRODUCT_GET]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
