'use client'

// components
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from '@/components/ui/popover'
import { useUpdateQueryParam } from '@/hooks/use-update-query-param'
// utils
import { Sliders } from 'lucide-react'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'

import { BrandCombobox, CategoriesCombobox, DateRange } from './options'

export function FilterButton({
   brand,
   category,
   categories,
   brands,
   startDate,
   endDate,
}) {
   const [open, setOpen] = useState(false)
   const { updateMany } = useUpdateQueryParam()

   const filterCount = useMemo(() => {
      let count = 0
      if (brand) count += 1
      if (category) {
         const categoryList = category.split('+').filter(Boolean)
         count += categoryList.length
      }
      if (startDate) count += 1
      if (endDate) count += 1
      return count
   }, [brand, category, startDate, endDate])

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
               className="w-auto flex items-center gap-2"
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
         <PopoverContent className="w-[350px]  p-4" side="bottom" align="end">
            <div className="grid gap-4">
               <div className="grid gap-2">
                  <Label className="pb-2">Category</Label>
                  <CategoriesCombobox
                     categories={categories}
                     initialCategory={category}
                  />
               </div>
               <div className="grid gap-2">
                  <Label className="pb-2">Brand</Label>
                  <BrandCombobox brands={brands} initialValue={brand} />
               </div>
               <div className="grid gap-2">
                  <DateRange from={startDate} to={endDate} />
               </div>

               <Button
                  onClick={() => {
                     updateMany({
                        brand: '',
                        category: '',
                        startDate: '',
                        endDate: '',
                        page: '1',
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
