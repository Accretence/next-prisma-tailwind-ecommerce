'use client'

import { Button } from '@/components/ui/button'
import {
   Command,
   CommandEmpty,
   CommandGroup,
   CommandInput,
   CommandItem,
   CommandList,
} from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import * as Slider from '@radix-ui/react-slider'
import { useDebounce } from '@/hooks/useDebounce'
import { useFilterReset } from '@/state/FilterReset'

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
import { Switch } from '@/components/ui/switch'
import { cn, isVariableValid } from '@/lib/utils'
import { slugify } from '@persepolis/slugify'
import { Check, ChevronsUpDown, RotateCcw } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useState, useEffect } from 'react'

export function ProductSearch({ initialSearch = '' }: { initialSearch?: string }) {
   const router = useRouter()
   const pathname = usePathname()
   const searchParams = useSearchParams()

   const [searchTerm, setSearchTerm] = useState(initialSearch)
   const debouncedSearch = useDebounce(searchTerm, 500)

   useEffect(() => {
      setSearchTerm(initialSearch)
   }, [initialSearch])

   useEffect(() => {
      const current = new URLSearchParams(Array.from(searchParams.entries()))

      if (debouncedSearch.trim()) {
         current.set('search', debouncedSearch.trim())
      } else {
         current.delete('search')
      }

      const query = current.toString()
      router.replace(`${pathname}${query ? `?${query}` : ''}`, {
         scroll: false,
      })
   }, [debouncedSearch, pathname, router, searchParams])

   return (
      <form className="w-full" onSubmit={(e) => e.preventDefault()}>
         <Input
         type="text"
         placeholder="Search products..."
         value={searchTerm}
         onChange={(e) => setSearchTerm(e.target.value)}
         className="w-full"
         />
      </form>
   )
}

export function PriceRange({
   initialMin = 0,
   initialMax = 1000,
   minPrice = 0,
   maxPrice = 1000,
   step = 10,
}: {
   initialMin?: number
   initialMax?: number
   minPrice?: number
   maxPrice?: number
   step?: number
}) {
   const router = useRouter()
   const pathname = usePathname()
   const searchParams = useSearchParams()
   const { resetSignal } = useFilterReset()

   const [range, setRange] = useState<[number, number]>([
      initialMin,
      initialMax,
   ])

   useEffect(() => {
      setRange([initialMin, initialMax])
   }, [initialMin, initialMax])

   useEffect(() => {
      setRange([initialMin, initialMax])
   }, [resetSignal])

   const handleCommit = (values: number[]) => {
      const [min, max] = values
      const current = new URLSearchParams(Array.from(searchParams.entries()))

      current.set('minPrice', min.toString())
      current.set('maxPrice', max.toString())

      const query = current.toString()
      router.replace(`${pathname}${query ? `?${query}` : ''}`, {
         scroll: false,
      })
   }

   return (
      <div className="space-y-2 px-4 w-full">
         <div className="flex justify-between text-xs text-muted-foreground">
            <span>${range[0]}</span>
            <span>${range[1]}</span>
         </div>

         <Slider.Root
            className="relative flex w-full touch-none select-none items-center"
            min={minPrice}
            max={maxPrice}
            step={step}
            value={range}
            onValueChange={(val) => setRange(val as [number, number])}
            onValueCommit={(val) => handleCommit(val as [number, number])}
            minStepsBetweenThumbs={1}
            >
            <Slider.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
               <Slider.Range className="absolute h-full bg-blue-500" />
            </Slider.Track>
            {range.map((_, i) => (
               <Slider.Thumb
                  key={i}
                  className="block h-4 w-4 rounded-full bg-white border-2 border-blue-500 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
               />
            ))}
         </Slider.Root>
      </div>
   )
}

type SortByProps = {
   initialData?: string
}

const sortOptions: Record<string, string> = {
   featured: "Featured",
   most_expensive: "Most Expensive",
   least_expensive: "Least Expensive",
   title_asc: "Title (A-Z)",
   title_desc: "Title (Z-A)",
}

export function SortBy({ initialData }: SortByProps) {
   const router = useRouter()
   const pathname = usePathname()
   const searchParams = useSearchParams()
   const { resetSignal } = useFilterReset()

   const [value, setValue] = useState<string | undefined>(undefined)
   const [selectKey, setSelectKey] = useState(0)

   // Set from initialData on first render
   useEffect(() => {
      if (isVariableValid(initialData)) {
         setValue(initialData)
      }
   }, [initialData])

   // Reset when resetSignal changes
   useEffect(() => {
      setValue(undefined)
      setSelectKey(prev => prev + 1)
   }, [resetSignal])

   const handleValueChange = (currentValue: string) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()))

      if (currentValue === value) {
         current.delete("sort")
         setValue(undefined)
      } else {
         current.set("sort", currentValue)
         setValue(currentValue)
      }

      const query = current.toString()
      router.replace(`${pathname}${query ? `?${query}` : ""}`, {
         scroll: false,
      })
   }

   return (
      <Select key={selectKey} value={value} onValueChange={handleValueChange}>
         <SelectTrigger className="w-full">
         <SelectValue placeholder="Sort By">
            {value ? sortOptions[value] : "Sort By"}
         </SelectValue>
         </SelectTrigger>
         <SelectContent>
         {Object.entries(sortOptions).map(([key, label]) => (
            <SelectItem key={key} value={key}>
               {label}
            </SelectItem>
         ))}
         </SelectContent>
      </Select>
   )
}

interface CategoriesComboboxProps {
   readonly categories: { title: string }[],
   readonly initialCategory?: string
}

export function CategoriesCombobox({ categories, initialCategory }: CategoriesComboboxProps) {
   const router = useRouter()
   const pathname = usePathname()
   const searchParams = useSearchParams()
   const { resetSignal } = useFilterReset()

   const [open, setOpen] = useState(false)
   const [selected, setSelected] = useState<string[]>([])

   useEffect(() => {
      if (!initialCategory) return

      const initialSlugs = initialCategory
         .split("+")
         .map((slug) => slug.trim())
         .filter(Boolean)
      setSelected(initialSlugs)
   }, [initialCategory])

   useEffect(() => {
      setSelected([])
   }, [resetSignal])

   const updateUrlParams = (selectedCategories: string[]) => {
      const params = new URLSearchParams(Array.from(searchParams.entries()))

      if (selectedCategories.length === 0) {
         params.delete("category")
      } else {
         params.set("category", selectedCategories.join("+"))
      }

      const queryString = params.toString()
      const url = queryString ? `${pathname}?${queryString}` : pathname

      router.replace(url, { scroll: false })
   }

   const toggleSelection = (slug: string) => {
      const newSelection = selected.includes(slug)
         ? selected.filter((s) => s !== slug)
         : [...selected, slug]

      setSelected(newSelection)
      updateUrlParams(newSelection)
   }

   const getDisplayedTitle = (): string => {
      const matchedTitles = categories
         .filter((cat) => selected.includes(slugify(cat.title)))
         .map((cat) => cat.title)

      if (matchedTitles.length > 2) {
         const [first, second, ...rest] = matchedTitles
         return `${first}, ${second}, +${rest.length} other${rest.length > 1 ? "s" : ""}`
      }

      return matchedTitles.join(", ")
   }

   return (
      <Popover open={open} onOpenChange={setOpen}>
         <PopoverTrigger asChild>
         <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between w-full"
         >
            {selected.length > 0 ? getDisplayedTitle() : "Select categories..."}
            <ChevronsUpDown className="h-4 ml-2 opacity-50 shrink-0" />
         </Button>
         </PopoverTrigger>

         <PopoverContent className="w-full p-0">
         <Command>
            <CommandInput placeholder="Search categories..." />
            <CommandList>
               <CommandEmpty>No category found.</CommandEmpty>
               <CommandGroup>
               {categories.map(({ title }) => {
                  const slug = slugify(title)
                  const isSelected = selected.includes(slug)

                  return (
                     <CommandItem
                        key={title}
                        value={slug}
                        onSelect={toggleSelection}
                     >
                     <Check className={cn("mr-2 h-4 w-4", isSelected ? "opacity-100" : "opacity-0")} />
                        {title}
                     </CommandItem>
                  )
               })}
               </CommandGroup>
            </CommandList>
         </Command>
         </PopoverContent>
      </Popover>
   )
}

export function BrandCombobox({ brands, initialBrand }) {
   const router = useRouter()
   const pathname = usePathname()
   const searchParams = useSearchParams()
   const { resetSignal } = useFilterReset()

   const [open, setOpen] = useState(false)
   const [selected, setSelected] = useState<string[]>([])

   useEffect(() => {
      if (!initialBrand) return

      const initialSlugs = initialBrand
         .split("+")
         .map((slug) => slug.trim())
         .filter(Boolean)

      setSelected(initialSlugs)
   }, [initialBrand])

   useEffect(() => {
      setSelected([])
   }, [resetSignal])

   const updateUrlParams = (selectedBrands: string[]) => {
      const params = new URLSearchParams(Array.from(searchParams.entries()))

      if (selectedBrands.length === 0) {
         params.delete("brand")
      } else {
         params.set("brand", selectedBrands.join("+"))
      }

      const queryString = params.toString()
      const url = queryString ? `${pathname}?${queryString}` : pathname

      router.replace(url, { scroll: false })
   }

   const toggleSelection = (slug: string) => {
      const newSelection = selected.includes(slug)
         ? selected.filter((s) => s !== slug)
         : [...selected, slug]

      setSelected(newSelection)
      updateUrlParams(newSelection)
   }

   const getDisplayedTitle = (): string => {
      const matchedTitles = brands
         .filter((b) => selected.includes(slugify(b.title)))
         .map((b) => b.title)

      if (matchedTitles.length > 2) {
         const [first, second, ...rest] = matchedTitles
         return `${first}, ${second}, +${rest.length} other${rest.length > 1 ? "s" : ""}`
      }

      return matchedTitles.join(", ")
   }

   return (
      <Popover open={open} onOpenChange={setOpen}>
         <PopoverTrigger asChild>
            <Button
               variant="outline"
               role="combobox"
               aria-expanded={open}
               className="w-full justify-between"
            >
               {selected.length > 0 ? getDisplayedTitle() : "Select brand..."}
               <ChevronsUpDown className="ml-2 h-4 shrink-0 opacity-50" />
            </Button>
         </PopoverTrigger>

         <PopoverContent className="w-full p-0">
            <Command>
               <CommandInput placeholder="Search brand..." />
               <CommandList>
                  <CommandEmpty>No brand found.</CommandEmpty>
                  <CommandGroup>
                     {brands.map(({ title }) => {
                        const slug = slugify(title)
                        const isSelected = selected.includes(slug)

                        return (
                           <CommandItem key={slug} value={slug} onSelect={() => toggleSelection(slug)}>
                              <Check
                                 className={cn(
                                    "mr-2 h-4 w-4",
                                    isSelected ? "opacity-100" : "opacity-0"
                                 )}
                              />
                              {title}
                           </CommandItem>
                        )
                     })}
                  </CommandGroup>
               </CommandList>
            </Command>
         </PopoverContent>
      </Popover>
   )
}

export function AvailableToggle({ initialData }) {
   const router = useRouter()
   const pathname = usePathname()
   const searchParams = useSearchParams()
   const [value, setValue] = useState(false)

   useEffect(() => {
      setValue(initialData === 'true' ? true : false)
   }, [initialData])

   return (
      <div className="flex w-full border rounded-md items-center space-x-2">
         <div className="mx-auto flex gap-2 items-center">
            <Switch
               checked={value}
               onCheckedChange={(currentValue: boolean) => {
                  const current = new URLSearchParams(
                     Array.from(searchParams.entries())
                  )

                  current.set(
                     'isAvailable',
                     currentValue == true ? 'true' : 'false'
                  )
                  setValue(currentValue)

                  // cast to string
                  const search = current.toString()
                  // or const query = `${'?'.repeat(search.length && 1)}${search}`;
                  const query = search ? `?${search}` : ''

                  router.replace(`${pathname}${query}`, {
                     scroll: false,
                  })
               }}
               id="available"
            />
            <Label htmlFor="available">Only Available</Label>
         </div>
      </div>
   )
}

export function ResetFiltersButton() {
   const router = useRouter()
   const pathname = usePathname()
   const searchParams = useSearchParams()
   const { triggerReset } = useFilterReset()
   const [hasFilters, setHasFilters] = useState(false)

   useEffect(() => {
      const params = Array.from(searchParams.entries())
      setHasFilters(params.length > 0)
   }, [searchParams])

   const handleReset = () => {
      if (!hasFilters) return
      
      router.replace(pathname, { scroll: false })
      triggerReset()
   }

   return (
      <div className="flex justify-start">
         <Button
            variant="outline"
            disabled={!hasFilters}
            onClick={handleReset}
            className="flex items-center gap-2 rounded-lg transition-colors"
         >
            <RotateCcw className="h-4 w-4" />
            <span>Reset Filters</span>
         </Button>
      </div>
   )
}