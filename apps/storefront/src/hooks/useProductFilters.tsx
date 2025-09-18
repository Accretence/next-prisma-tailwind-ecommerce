'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useMemo } from 'react'

export interface ProductFilters {
   search?: string
   minPrice?: number
   maxPrice?: number
   brand?: string
   category?: string
   sort?: string
   isAvailable?: boolean
   page?: number
}

export function useProductFilters() {
   const router = useRouter()
   const pathname = usePathname()
   const searchParams = useSearchParams()

   // Get current filter values from URL
   const currentFilters = useMemo(() => ({
      search: searchParams.get('search') || '',
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      brand: searchParams.get('brand') || '',
      category: searchParams.get('category') || '',
      sort: searchParams.get('sort') || 'featured',
      isAvailable: searchParams.get('isAvailable') === 'true',
      page: Number(searchParams.get('page')) || 1,
   }), [searchParams])

   // Update filters in URL
   const updateFilters = useCallback((newFilters: Partial<ProductFilters>) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()))
      
      Object.entries(newFilters).forEach(([key, value]) => {
         if (value === '' || value === undefined || value === false || value === 0) {
            current.delete(key)
         } else {
            current.set(key, String(value))
         }
      })

      // Always reset to page 1 when filters change (except when updating page)
      if (!newFilters.hasOwnProperty('page')) {
         current.delete('page')
      }

      const search = current.toString()
      const query = search ? `?${search}` : ''
      router.replace(`${pathname}${query}`, { scroll: false })
   }, [searchParams, pathname, router])

   // Clear all filters
   const clearFilters = useCallback(() => {
      router.replace(pathname, { scroll: false })
   }, [pathname, router])

   // Get count of active filters
   const activeFiltersCount = useMemo(() => {
      return [
         currentFilters.search,
         currentFilters.brand,
         currentFilters.category,
         currentFilters.minPrice && currentFilters.minPrice > 0,
         currentFilters.maxPrice && currentFilters.maxPrice < 1000,
         currentFilters.isAvailable,
         currentFilters.sort !== 'featured'
      ].filter(Boolean).length
   }, [currentFilters])

   return {
      filters: currentFilters,
      updateFilters,
      clearFilters,
      activeFiltersCount,
   }
}
