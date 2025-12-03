'use client'

import { ButtonProps, buttonVariants } from '@/components/ui/button'
import { useUpdateQueryParam } from '@/hooks/use-update-query-param'
import { cn } from '@/lib/utils'
import {
   ChevronLeftIcon,
   ChevronRightIcon,
   DotsHorizontalIcon,
} from '@radix-ui/react-icons'
import * as React from 'react'

const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>) => (
   <nav
      role="navigation"
      aria-label="pagination"
      className={cn('mx-auto flex w-full justify-center', className)}
      {...props}
   />
)
Pagination.displayName = 'Pagination'

const PaginationContent = React.forwardRef<
   HTMLUListElement,
   React.ComponentProps<'ul'>
>(({ className, ...props }, ref) => (
   <ul
      ref={ref}
      className={cn('flex flex-row items-center gap-1', className)}
      {...props}
   />
))
PaginationContent.displayName = 'PaginationContent'

const PaginationItem = React.forwardRef<
   HTMLLIElement,
   React.ComponentProps<'li'>
>(({ className, ...props }, ref) => (
   <li ref={ref} className={cn('', className)} {...props} />
))
PaginationItem.displayName = 'PaginationItem'

type PaginationLinkProps = {
   isActive?: boolean
} & Pick<ButtonProps, 'size'> &
   React.ComponentProps<'a'>

const PaginationLink = ({
   className,
   isActive,
   size = 'icon',
   ...props
}: PaginationLinkProps) => (
   <a
      aria-current={isActive ? 'page' : undefined}
      className={cn(
         buttonVariants({
            variant: isActive ? 'outline' : 'ghost',
            size,
         }),
         className
      )}
      {...props}
   />
)
PaginationLink.displayName = 'PaginationLink'

const PaginationPrevious = ({
   className,
   ...props
}: React.ComponentProps<typeof PaginationLink>) => (
   <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn('gap-1 pl-2.5', className)}
      {...props}
   >
      <ChevronLeftIcon className="h-4 w-4" />
      <span>Previous</span>
   </PaginationLink>
)
PaginationPrevious.displayName = 'PaginationPrevious'

const PaginationNext = ({
   className,
   ...props
}: React.ComponentProps<typeof PaginationLink>) => (
   <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn('gap-1 pr-2.5', className)}
      {...props}
   >
      <span>Next</span>
      <ChevronRightIcon className="h-4 w-4" />
   </PaginationLink>
)
PaginationNext.displayName = 'PaginationNext'

const PaginationEllipsis = ({
   className,
   ...props
}: React.ComponentProps<'span'>) => (
   <span
      aria-hidden
      className={cn('flex h-9 w-9 items-center justify-center', className)}
      {...props}
   >
      <DotsHorizontalIcon className="h-4 w-4" />
      <span className="sr-only">More pages</span>
   </span>
)
PaginationEllipsis.displayName = 'PaginationEllipsis'

type Props = {
   totalPages: number
   currentPage: number
   onPageChange?: (page: number) => void
}
const PaginationComponent = ({
   totalPages,
   currentPage,
   onPageChange,
}: Props) => {
   const handleChange = (page: number) => {
      if (page < 1 || page > totalPages) return
      onPageChange?.(page)
   }

   const { updateQuery } = useUpdateQueryParam()

   return (
      <Pagination>
         <PaginationContent>
            {/* Previous */}
            {currentPage > 1 && (
               <PaginationItem>
                  <PaginationPrevious
                     href="#"
                     onClick={(e) => {
                        e.preventDefault()
                        handleChange(currentPage - 1)
                        updateQuery('page', String(currentPage - 1))
                     }}
                  />
               </PaginationItem>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
               <PaginationItem key={page}>
                  <PaginationLink
                     href="#"
                     isActive={page === currentPage}
                     onClick={(e) => {
                        e.preventDefault()
                        handleChange(page)
                        updateQuery('page', String(page))
                     }}
                  >
                     {page}
                  </PaginationLink>
               </PaginationItem>
            ))}

            {/* Next */}
            {currentPage < totalPages && (
               <PaginationItem>
                  <PaginationNext
                     href="#"
                     onClick={(e) => {
                        e.preventDefault()
                        handleChange(currentPage + 1)
                        updateQuery('page', String(currentPage + 1))
                     }}
                  />
               </PaginationItem>
            )}
         </PaginationContent>
      </Pagination>
   )
}

export {
   Pagination,
   PaginationContent,
   PaginationLink,
   PaginationItem,
   PaginationPrevious,
   PaginationNext,
   PaginationEllipsis,
   PaginationComponent,
}
