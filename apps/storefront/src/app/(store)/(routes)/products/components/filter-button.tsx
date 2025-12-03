'use client'

// components
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from '@/components/ui/popover'
// utils
import { useUpdateQueryParam } from '@/hooks/useUpdateQueryParam'
import { Sliders } from 'lucide-react'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'

import {
   BrandCombobox,
   CategoriesCombobox,
   PriceRange,
   SortBy,
} from './options'

export function FilterButton({
   sort,
   brand,
   category,
   categories,
   brands,
   minPrice,
   maxPrice,
}) {
   const [open, setOpen] = useState(false)
   const { updateMany } = useUpdateQueryParam()

   const filterCount = useMemo(() => {
      let count = 0
      if (sort) count += 1
      if (brand) count += 1
      if (category) {
         const categoryList = category.split('+').filter(Boolean)
         count += categoryList.length
      }
      if (minPrice) count += 1
      if (maxPrice) count += 1
      return count
   }, [sort, brand, category, minPrice, maxPrice])

   return (
      <Popover
         open={open}
         onOpenChange={() => {
            setOpen(!open)
         }}
      >
         <PopoverTrigger asChild>
            <Button
               variant="outline"
               className="w-full md:w-auto flex items-center gap-2"
            >
               <Sliders className="h-4 w-4" />

               {/* Label + badge wrapper */}
               <div className="relative flex items-center">
                  <span>Filter</span>
                  {filterCount > 0 && (
                     <span
                        className="absolute -top-1 -right-3 flex h-3 w-3 items-center justify-center
        rounded-full bg-primary text-[11px] font-bold text-primary-foreground"
                     >
                        {filterCount}
                     </span>
                  )}
               </div>
            </Button>
         </PopoverTrigger>
         <PopoverContent
            className="w-[300px] max-w-md p-4"
            side="bottom"
            align="end"
         >
            <div className="grid gap-4">
               <div className="grid gap-2">
                  <Label className="pb-2">Sort By</Label>
                  <SortBy
                     value={sort}
                     onChange={(value) => {
                        if (value !== sort) {
                           updateMany({ sort: value })
                        } else {
                           updateMany({ sort: '' })
                        }
                     }}
                  />
               </div>
               <div className="grid gap-2">
                  <Label className="pb-2">Category</Label>
                  <CategoriesCombobox
                     categories={categories}
                     initialCategory={category}
                     onChange={(value) => {
                        updateMany({
                           category: value,
                        })
                        toast.success('Category filter updated')
                     }}
                  />
               </div>
               <div className="grid gap-2">
                  <Label className="pb-2">Price Range</Label>
                  <PriceRange
                     initialMaxValue={maxPrice}
                     initialMinValue={minPrice}
                  />
               </div>
               <div className="grid gap-2">
                  <Label className="pb-2">Brand</Label>
                  <BrandCombobox brands={brands} initialValue={brand} />
               </div>

               <Button
                  onClick={() => {
                     updateMany({
                        sort: '',
                        brand: '',
                        category: '',
                        minPrice: '',
                        maxPrice: '',
                     })
                     toast.success('Filters cleared successfully')
                     setOpen(false)
                  }}
               >
                  Clear Filters
               </Button>
            </div>
         </PopoverContent>
      </Popover>
   )
}
