import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
   try {
      const { searchParams } = new URL(req.url)
      
      // Extract filter parameters
      const search = searchParams.get('search')
      const minPrice = searchParams.get('minPrice')
      const maxPrice = searchParams.get('maxPrice')
      const brand = searchParams.get('brand')
      const category = searchParams.get('category')
      const sort = searchParams.get('sort')
      const isAvailable = searchParams.get('isAvailable')
      const page = parseInt(searchParams.get('page') || '1')
      const limit = parseInt(searchParams.get('limit') || '12')

      // Build where clause
      const where: any = {}

      // Text search across title, description, and keywords
      if (search) {
         where.OR = [
            {
               title: {
                  contains: search,
                  mode: 'insensitive',
               },
            },
            {
               description: {
                  contains: search,
                  mode: 'insensitive',
               },
            },
            {
               keywords: {
                  hasSome: [search],
               },
            },
         ]
      }

      // Price range filter
      if (minPrice || maxPrice) {
         where.price = {}
         if (minPrice) {
            where.price.gte = parseFloat(minPrice)
         }
         if (maxPrice) {
            where.price.lte = parseFloat(maxPrice)
         }
      }

      // Brand filter
      if (brand) {
         where.brand = {
            title: {
               contains: brand,
               mode: 'insensitive',
            },
         }
      }

      // Category filter
      if (category) {
         where.categories = {
            some: {
               title: {
                  contains: category,
                  mode: 'insensitive',
               },
            },
         }
      }

      // Availability filter
      if (isAvailable === 'true') {
         where.isAvailable = true
      }

      // Build orderBy clause
      let orderBy: any = {}
      switch (sort) {
         case 'most_expensive':
            orderBy = { price: 'desc' }
            break
         case 'least_expensive':
            orderBy = { price: 'asc' }
            break
         case 'title_asc':
            orderBy = { title: 'asc' }
            break
         case 'title_desc':
            orderBy = { title: 'desc' }
            break
         case 'featured':
         default:
            orderBy = { isFeatured: 'desc' }
            break
      }

      // Get total count for pagination
      const totalCount = await prisma.product.count({ where })

      // Fetch products with pagination
      const products = await prisma.product.findMany({
         where,
         orderBy,
         skip: (page - 1) * limit,
         take: limit,
         include: {
            brand: true,
            categories: true,
         },
      })

      return NextResponse.json({
         products,
         pagination: {
            page,
            limit,
            total: totalCount,
            pages: Math.ceil(totalCount / limit),
         },
      })
   } catch (error) {
      console.error('[PRODUCT_GET]', error)
      return new NextResponse('Internal error', { status: 500 })
   }
}
