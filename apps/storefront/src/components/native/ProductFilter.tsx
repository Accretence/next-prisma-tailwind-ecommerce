'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from '@/components/ui/popover'
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { cn, isVariableValid } from '@/lib/utils'
import { slugify } from '@persepolis/slugify'
import { Check, ChevronsUpDown, Search, X } from 'lucide-react'
import { useProductFilters } from '@/hooks/useProductFilters'
import React, { useEffect, useState } from 'react'

interface ProductFilterProps {
   brands: Array<{ id: string; title: string }>
   categories: Array<{ id: string; title: string }>
   searchParams: {
      search?: string
      minPrice?: string
      maxPrice?: string
      brand?: string
      category?: string
      sort?: string
      isAvailable?: string
   }
}

export function ProductFilter({ brands, categories, searchParams }: ProductFilterProps) {
   const { filters, updateFilters, clearFilters, activeFiltersCount } = useProductFilters()

   // State for all filters
   const [search, setSearch] = useState(filters.search || '')
   const [priceRange, setPriceRange] = useState([
      filters.minPrice || 0,
      filters.maxPrice || 1000,
   ])
   const [selectedBrand, setSelectedBrand] = useState(filters.brand || '')
   const [selectedCategory, setSelectedCategory] = useState(filters.category || '')
   const [sortBy, setSortBy] = useState(filters.sort || 'featured')
   const [isAvailable, setIsAvailable] = useState(filters.isAvailable || false)

   // Sync local state with URL params
   useEffect(() => {
      setSearch(filters.search || '')
      setPriceRange([filters.minPrice || 0, filters.maxPrice || 1000])
      setSelectedBrand(filters.brand || '')
      setSelectedCategory(filters.category || '')
      setSortBy(filters.sort || 'featured')
      setIsAvailable(filters.isAvailable || false)
   }, [filters])

   // Handle search input
   const handleSearch = (value: string) => {
      setSearch(value)
      updateFilters({ search: value })
   }

   // Handle price range change
   const handlePriceRangeChange = (value: number[]) => {
      setPriceRange(value)
      updateFilters({ 
         minPrice: value[0] > 0 ? value[0] : undefined,
         maxPrice: value[1] < 1000 ? value[1] : undefined,
      })
   }


   // Handle brand selection
   const handleBrandChange = (value: string) => {
      const newValue = value === selectedBrand ? '' : value
      setSelectedBrand(newValue)
      updateFilters({ brand: newValue })
   }

   // Handle category selection
   const handleCategoryChange = (value: string) => {
      const newValue = value === selectedCategory ? '' : value
      setSelectedCategory(newValue)
      updateFilters({ category: newValue })
   }

   // Handle sort change
   const handleSortChange = (value: string) => {
      setSortBy(value)
      updateFilters({ sort: value })
   }

   // Handle availability toggle
   const handleAvailabilityChange = (value: boolean) => {
      setIsAvailable(value)
      updateFilters({ isAvailable: value })
   }


   // Get display names for selected values
   const getBrandTitle = () => {
      const brand = brands.find(b => slugify(b.title) === slugify(selectedBrand))
      return brand?.title || 'All Brands'
   }

   const getCategoryTitle = () => {
      const category = categories.find(c => slugify(c.title) === slugify(selectedCategory))
      return category?.title || 'All Categories'
   }


   return (
      <div className="space-y-4">
         {/* Search Bar */}
         <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
               placeholder="Search products..."
               value={search}
               onChange={(e) => handleSearch(e.target.value)}
               className="pl-10"
            />
         </div>

         {/* Filter Controls */}
         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {/* Sort Dropdown */}
            <Select value={sortBy} onValueChange={handleSortChange}>
               <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
               </SelectTrigger>
               <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="most_expensive">Most Expensive Products</SelectItem>
                  <SelectItem value="least_expensive">Cheapest Products</SelectItem>
                  <SelectItem value="title_asc">Title A-Z</SelectItem>
                  <SelectItem value="title_desc">Title Z-A</SelectItem>
               </SelectContent>
            </Select>

            {/* Brand Filter */}
            <Popover>
               <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[180px] justify-between">
                     {getBrandTitle()}
                     <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
               </PopoverTrigger>
               <PopoverContent className="w-[200px] p-0">
                  <div className="p-2">
                     <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => handleBrandChange('')}
                     >
                        <Check className={cn("mr-2 h-4 w-4", !selectedBrand ? "opacity-100" : "opacity-0")} />
                        All Brands
                     </Button>
                     {brands.map((brand) => (
                        <Button
                           key={brand.id}
                           variant="ghost"
                           className="w-full justify-start"
                           onClick={() => handleBrandChange(slugify(brand.title))}
                        >
                           <Check className={cn("mr-2 h-4 w-4", selectedBrand === slugify(brand.title) ? "opacity-100" : "opacity-0")} />
                           {brand.title}
                        </Button>
                     ))}
                  </div>
               </PopoverContent>
            </Popover>

            {/* Category Filter */}
            <Popover>
               <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[180px] justify-between">
                     {getCategoryTitle()}
                     <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
               </PopoverTrigger>
               <PopoverContent className="w-[200px] p-0">
                  <div className="p-2">
                     <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => handleCategoryChange('')}
                     >
                        <Check className={cn("mr-2 h-4 w-4", !selectedCategory ? "opacity-100" : "opacity-0")} />
                        All Categories
                     </Button>
                     {categories.map((category) => (
                        <Button
                           key={category.id}
                           variant="ghost"
                           className="w-full justify-start"
                           onClick={() => handleCategoryChange(slugify(category.title))}
                        >
                           <Check className={cn("mr-2 h-4 w-4", selectedCategory === slugify(category.title) ? "opacity-100" : "opacity-0")} />
                           {category.title}
                        </Button>
                     ))}
                  </div>
               </PopoverContent>
            </Popover>

            {/* Price Range Filter */}
            <div className="w-[180px] space-y-2">
               <Label className="text-sm">Price: ${priceRange[0]} - ${priceRange[1]}</Label>
               <Slider
                  value={priceRange}
                  onValueChange={handlePriceRangeChange}
                  max={1000}
                  min={0}
                  step={10}
                  className="w-full"
               />
               <div className="flex justify-between text-xs text-gray-500">
                  <span>$0</span>
                  <span>$1000+</span>
               </div>
            </div>

            {/* Availability Toggle */}
            <div className="w-[180px] flex items-center space-x-2 border rounded-md px-3 py-2">
               <Switch
                  id="available"
                  checked={isAvailable}
                  onCheckedChange={handleAvailabilityChange}
               />
               <Label htmlFor="available" className="text-sm">Available Only</Label>
            </div>
         </div>

         {/* Clear Filters */}
         {activeFiltersCount > 0 && (
            <div className="flex justify-end">
               <Button variant="outline" onClick={clearFilters}>
                  <X className="mr-2 h-4 w-4" />
                  Clear All Filters
               </Button>
            </div>
         )}

         {/* Active Filters Display */}
         {(search || selectedBrand || selectedCategory || priceRange[0] > 0 || priceRange[1] < 1000 || isAvailable) && (
            <div className="flex flex-wrap gap-2">
               {search && (
                  <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm">
                     Search: "{search}"
                     <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 ml-1"
                        onClick={() => updateFilters({ search: '' })}
                     >
                        <X className="h-3 w-3" />
                     </Button>
                  </div>
               )}
               {selectedBrand && (
                  <div className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm">
                     Brand: {getBrandTitle()}
                     <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 ml-1"
                        onClick={() => updateFilters({ brand: '' })}
                     >
                        <X className="h-3 w-3" />
                     </Button>
                  </div>
               )}
               {selectedCategory && (
                  <div className="flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-1 rounded-md text-sm">
                     Category: {getCategoryTitle()}
                     <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 ml-1"
                        onClick={() => updateFilters({ category: '' })}
                     >
                        <X className="h-3 w-3" />
                     </Button>
                  </div>
               )}
               {(priceRange[0] > 0 || priceRange[1] < 1000) && (
                  <div className="flex items-center gap-1 bg-orange-100 text-orange-800 px-2 py-1 rounded-md text-sm">
                     Price: ${priceRange[0]} - ${priceRange[1]}
                     <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 ml-1"
                        onClick={() => updateFilters({ minPrice: undefined, maxPrice: undefined })}
                     >
                        <X className="h-3 w-3" />
                     </Button>
                  </div>
               )}
               {isAvailable && (
                  <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md text-sm">
                     Available Only
                     <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 ml-1"
                        onClick={() => updateFilters({ isAvailable: false })}
                     >
                        <X className="h-3 w-3" />
                     </Button>
                  </div>
               )}
            </div>
         )}
      </div>
   )
}
