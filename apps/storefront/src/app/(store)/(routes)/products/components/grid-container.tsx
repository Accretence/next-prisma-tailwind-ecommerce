'use client'

import { ProductGrid, ProductSkeletonGrid } from '@/components/native/Product'
import React, { useEffect } from 'react'
import { useFilterLoading } from './filter-loading'
import { useSearchParams } from 'next/navigation'

export default function GridContainer({ products }) {
   const { isPending, setPending } = useFilterLoading()
   const searchParams = useSearchParams()

   useEffect(() => {
      setPending(false)
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [products, searchParams])

   if (isPending) return <ProductSkeletonGrid />
   return <ProductGrid products={products} />
}


