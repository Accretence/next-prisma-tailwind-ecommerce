'use client'

import { Button } from '@/components/ui/button'
import { useProductFilters } from '@/hooks/useProductFilters'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
   currentPage: number
   totalPages: number
   totalItems: number
   itemsPerPage: number
}

export function Pagination({ currentPage, totalPages, totalItems, itemsPerPage }: PaginationProps) {
   const { updateFilters } = useProductFilters()

   const handlePageChange = (page: number) => {
      updateFilters({ page })
   }

   const getVisiblePages = () => {
      const delta = 2
      const range = []
      const rangeWithDots = []

      for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
         range.push(i)
      }

      if (currentPage - delta > 2) {
         rangeWithDots.push(1, '...')
      } else {
         rangeWithDots.push(1)
      }

      rangeWithDots.push(...range)

      if (currentPage + delta < totalPages - 1) {
         rangeWithDots.push('...', totalPages)
      } else {
         rangeWithDots.push(totalPages)
      }

      return rangeWithDots
   }

   if (totalPages <= 1) return null

   const startItem = (currentPage - 1) * itemsPerPage + 1
   const endItem = Math.min(currentPage * itemsPerPage, totalItems)

   return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
         <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {startItem} to {endItem} of {totalItems} results
         </div>
         
         <div className="flex items-center gap-2">
            <Button
               variant="outline"
               size="sm"
               onClick={() => handlePageChange(currentPage - 1)}
               disabled={currentPage === 1}
            >
               <ChevronLeft className="h-4 w-4" />
               Previous
            </Button>

            <div className="flex items-center gap-1">
               {getVisiblePages().map((page, index) => (
                  <div key={index}>
                     {page === '...' ? (
                        <span className="px-3 py-2 text-sm">...</span>
                     ) : (
                        <Button
                           variant={currentPage === page ? "default" : "outline"}
                           size="sm"
                           onClick={() => handlePageChange(page as number)}
                           className="w-10"
                        >
                           {page}
                        </Button>
                     )}
                  </div>
               ))}
            </div>

            <Button
               variant="outline"
               size="sm"
               onClick={() => handlePageChange(currentPage + 1)}
               disabled={currentPage === totalPages}
            >
               Next
               <ChevronRight className="h-4 w-4" />
            </Button>
         </div>
      </div>
   )
}
