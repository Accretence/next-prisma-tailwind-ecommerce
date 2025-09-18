'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, X } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

interface Brand {
   id: string
   title: string
}

interface Category {
   id: string
   title: string
}

export function ReportsFilters() {
   const router = useRouter()
   const pathname = usePathname()
   const searchParams = useSearchParams()

   const [startDate, setStartDate] = useState<Date | undefined>(
      searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : undefined
   )
   const [endDate, setEndDate] = useState<Date | undefined>(
      searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : undefined
   )
   const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all')
   const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || 'all')
   const [brands, setBrands] = useState<Brand[]>([])
   const [categories, setCategories] = useState<Category[]>([])

   // Fetch brands and categories
   useEffect(() => {
      const fetchData = async () => {
         try {
            const [brandsRes, categoriesRes] = await Promise.all([
               fetch('/api/brands'),
               fetch('/api/categories')
            ])
            
            if (brandsRes.ok) {
               const brandsData = await brandsRes.json()
               setBrands(brandsData)
            }
            
            if (categoriesRes.ok) {
               const categoriesData = await categoriesRes.json()
               setCategories(categoriesData)
            }
         } catch (error) {
            console.error('Error fetching filter data:', error)
         }
      }

      fetchData()
   }, [])

   const updateFilters = () => {
      const params = new URLSearchParams(searchParams.toString())
      
      if (startDate) {
         params.set('startDate', startDate.toISOString().split('T')[0])
      } else {
         params.delete('startDate')
      }
      
      if (endDate) {
         params.set('endDate', endDate.toISOString().split('T')[0])
      } else {
         params.delete('endDate')
      }
      
      if (selectedCategory && selectedCategory !== 'all') {
         params.set('category', selectedCategory)
      } else {
         params.delete('category')
      }
      
      if (selectedBrand && selectedBrand !== 'all') {
         params.set('brand', selectedBrand)
      } else {
         params.delete('brand')
      }

      router.push(`${pathname}?${params.toString()}`)
   }

   const clearFilters = () => {
      setStartDate(undefined)
      setEndDate(undefined)
      setSelectedCategory('all')
      setSelectedBrand('all')
      router.push(pathname)
   }

   const hasActiveFilters = startDate || endDate || (selectedCategory && selectedCategory !== 'all') || (selectedBrand && selectedBrand !== 'all')

   return (
      <div className="space-y-4">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Start Date */}
            <div className="space-y-2">
               <Label>Start Date</Label>
               <Popover>
                  <PopoverTrigger asChild>
                     <Button
                        variant="outline"
                        className={cn(
                           'w-full justify-start text-left font-normal',
                           !startDate && 'text-muted-foreground'
                        )}
                     >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, 'PPP') : 'Select start date'}
                     </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                     <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                     />
                  </PopoverContent>
               </Popover>
            </div>

            {/* End Date */}
            <div className="space-y-2">
               <Label>End Date</Label>
               <Popover>
                  <PopoverTrigger asChild>
                     <Button
                        variant="outline"
                        className={cn(
                           'w-full justify-start text-left font-normal',
                           !endDate && 'text-muted-foreground'
                        )}
                     >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, 'PPP') : 'Select end date'}
                     </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                     <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                     />
                  </PopoverContent>
               </Popover>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
               <Label>Category</Label>
               <Select value={selectedCategory || undefined} onValueChange={(value) => setSelectedCategory(value || '')}>
                  <SelectTrigger>
                     <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="all">All categories</SelectItem>
                     {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                           {category.title}
                        </SelectItem>
                     ))}
                  </SelectContent>
               </Select>
            </div>

            {/* Brand Filter */}
            <div className="space-y-2">
               <Label>Brand</Label>
               <Select value={selectedBrand || undefined} onValueChange={(value) => setSelectedBrand(value || '')}>
                  <SelectTrigger>
                     <SelectValue placeholder="All brands" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="all">All brands</SelectItem>
                     {brands.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id}>
                           {brand.title}
                        </SelectItem>
                     ))}
                  </SelectContent>
               </Select>
            </div>
         </div>

         {/* Action Buttons */}
         <div className="flex gap-2">
            <Button onClick={updateFilters}>
               Apply Filters
            </Button>
            {hasActiveFilters && (
               <Button variant="outline" onClick={clearFilters}>
                  <X className="mr-2 h-4 w-4" />
                  Clear Filters
               </Button>
            )}
         </div>

         {/* Active Filters Display */}
         {hasActiveFilters && (
            <div className="flex flex-wrap gap-2">
               {startDate && (
                  <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm">
                     From: {format(startDate, 'MMM dd, yyyy')}
                     <button
                        onClick={() => setStartDate(undefined)}
                        className="ml-1 hover:text-blue-600"
                     >
                        <X className="h-3 w-3" />
                     </button>
                  </div>
               )}
               {endDate && (
                  <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm">
                     To: {format(endDate, 'MMM dd, yyyy')}
                     <button
                        onClick={() => setEndDate(undefined)}
                        className="ml-1 hover:text-blue-600"
                     >
                        <X className="h-3 w-3" />
                     </button>
                  </div>
               )}
               {selectedCategory && selectedCategory !== 'all' && (
                  <div className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm">
                     Category: {categories.find(c => c.id === selectedCategory)?.title}
                     <button
                        onClick={() => setSelectedCategory('all')}
                        className="ml-1 hover:text-green-600"
                     >
                        <X className="h-3 w-3" />
                     </button>
                  </div>
               )}
               {selectedBrand && selectedBrand !== 'all' && (
                  <div className="flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-1 rounded-md text-sm">
                     Brand: {brands.find(b => b.id === selectedBrand)?.title}
                     <button
                        onClick={() => setSelectedBrand('all')}
                        className="ml-1 hover:text-purple-600"
                     >
                        <X className="h-3 w-3" />
                     </button>
                  </div>
               )}
            </div>
         )}
      </div>
   )
}
