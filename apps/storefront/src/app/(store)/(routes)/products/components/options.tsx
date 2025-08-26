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
import { Input } from "@/components/ui/input"
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
import { Switch } from '@/components/ui/switch'
import { cn, isVariableValid } from '@/lib/utils'
import { slugify } from '@persepolis/slugify'
import { Check, ChevronsUpDown } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'

export function SortBy({ initialData }) {
   const router = useRouter()
   const pathname = usePathname()
   const searchParams = useSearchParams()

   const [value, setValue] = React.useState('featured')

   useEffect(() => {
      if (isVariableValid(initialData)) setValue(initialData)
   }, [initialData])

   return (
      <Select
         onValueChange={(currentValue) => {
            const current = new URLSearchParams(
               Array.from(searchParams.entries())
            )

            if (currentValue === value) {
               current.delete('sort')
               setValue('')
            } else {
               current.set('sort', currentValue)
               setValue(currentValue)
            }

            // cast to string
            const search = current.toString()
            // or const query = `${'?'.repeat(search.length && 1)}${search}`;
            const query = search ? `?${search}` : ''

            router.replace(`${pathname}${query}`, {
               scroll: false,
            })
         }}
      >
         <SelectTrigger className="w-full">
            <SelectValue placeholder="Sort By" />
         </SelectTrigger>
         <SelectContent>
            {/* <SelectItem value="featured">Featured</SelectItem> */}
            <SelectItem value="most_expensive">Most Expensive</SelectItem>
            <SelectItem value="least_expensive">Least Expensive</SelectItem>
            <SelectItem value="title_asc">Title (A-Z)</SelectItem>
            <SelectItem value="title_desc">Title (Z-A)</SelectItem>
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

   const [open, setOpen] = React.useState(false)
   const [selected, setSelected] = React.useState<string[]>([])

   useEffect(() => {
      if (!initialCategory) return

      const initialSlugs = initialCategory.split(",").map((slug) => slug.trim())
      setSelected(initialSlugs)
   }, [initialCategory])

   const toggleSelection = (slug: string) => {
      const selectedCategories = selected.includes(slug)
         ? selected.filter((s) => s !== slug)
         : [...selected, slug]

      setSelected(selectedCategories)

      const current = new URLSearchParams(
         Array.from(searchParams.entries())
      )

      if (selectedCategories.length === 0) {
         current.delete('category')
      } else {
         current.set('category', selectedCategories.join(','))
      }

      const search = current.toString()
      const query = search ? `?${search}` : ''
      router.replace(`${pathname}${query}`, { scroll: false })
   }

   const getDisplayedTitle = () => {
      const matched = categories
         .filter((cat) => selected.includes(slugify(cat.title)))
         .map((cat) => cat.title)

      if (matched.length > 2) {
         const [first, second, ...rest] = matched
         return `${first}, ${second}, +${rest.length} other${rest.length > 1 ? "s" : ""}`
      }

      return matched.join(", ")
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
            {selected.length ? getDisplayedTitle() : "Select categories..."}
            <ChevronsUpDown className="h-4 ml-2 opacity-50 shrink-0" />
         </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
         <Command>
            <CommandInput placeholder="Search categories..." />
            <CommandList>
            <CommandEmpty>No category found.</CommandEmpty>
            <CommandGroup>
               {categories.map((cat) => {
                  const slug = slugify(cat.title)
                  const isSelected = selected.includes(slug)

                  return (
                  <CommandItem key={cat.title} onSelect={() => toggleSelection(slug)}>
                     <Check className={cn("mr-2 h-4 w-4", isSelected ? "opacity-100" : "opacity-0")} />
                     {cat.title}
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

   const [open, setOpen] = React.useState(false)
   const [value, setValue] = React.useState('')

   function getBrandTitle() {
      for (const brand of brands) {
         if (slugify(brand.title) === slugify(value)) return brand.title
      }
   }

   useEffect(() => {
      setValue(initialBrand)
   }, [initialBrand])

   return (
      <Popover open={open} onOpenChange={setOpen}>
         <PopoverTrigger asChild>
            <Button
               variant="outline"
               role="combobox"
               aria-expanded={open}
               className="w-full justify-between"
            >
               {value ? getBrandTitle() : 'Select brand...'}
               <ChevronsUpDown className="ml-2 h-4 shrink-0 opacity-50" />
            </Button>
         </PopoverTrigger>
         <PopoverContent className="w-full p-0">
            <Command>
               <CommandInput placeholder="Search brand..." />
               <CommandList>
                  <CommandEmpty>No brand found.</CommandEmpty>
                  <CommandGroup>
                     {brands.map((brand) => (
                        <CommandItem
                           key={brand.title}
                           onSelect={(currentValue) => {
                              const current = new URLSearchParams(
                                 Array.from(searchParams.entries())
                              )

                              if (currentValue === value) {
                                 current.delete('brand')
                                 setValue('')
                              } else {
                                 current.set('brand', currentValue)
                                 setValue(currentValue)
                              }

                              // cast to string
                              const search = current.toString()
                              // or const query = `${'?'.repeat(search.length && 1)}${search}`;
                              const query = search ? `?${search}` : ''

                              router.replace(`${pathname}${query}`, {
                                 scroll: false,
                              })

                              setOpen(false)
                           }}
                        >
                           <Check
                              className={cn(
                                 'mr-2 h-4',
                                 value === brand.title
                                    ? 'opacity-100'
                                    : 'opacity-0'
                              )}
                           />
                           {brand.title}
                        </CommandItem>
                     ))}
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
   const [value, setValue] = React.useState(false)

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

interface SearchProps {
   readonly initialSearchQuery: string
}

export function ProductSearchInput({ initialSearchQuery }: SearchProps) {
   const router = useRouter()
   const pathname = usePathname()
   const searchParams = useSearchParams()

   const [value, setValue] = React.useState('')
   const [debouncedValue, setDebouncedValue] = React.useState('')

   useEffect(() => {
      if (isVariableValid(initialSearchQuery)) {
         setValue(initialSearchQuery)
      }
   }, [initialSearchQuery])

   // Add delay while user search to avoid api request immediately
   useEffect(() => {
      const timeout = setTimeout(() => {
         setDebouncedValue(value)
      }, 500)

      return () => clearTimeout(timeout);
   }, [value])

   useEffect(() => {
      const current = new URLSearchParams(Array.from(searchParams.entries()))

      if (debouncedValue) {
         current.set('search', debouncedValue)
      } else {
         current.delete('search')
      }

      // Only update the URL if it actually changed from the current one.
      const newQuery = current.toString();
      const newUrl = `${pathname}${newQuery ? `?${newQuery}` : ""}`;

      if (newUrl !== `${pathname}?${searchParams.toString()}`) {
         router.replace(newUrl, { scroll: false });
      }

   }, [debouncedValue])

   return (
      <Input
         type="text"
         placeholder="Search products..."
         value={value}
         onChange={(e) => setValue(e.target.value)}
         className="w-full focus-visible:ring-0"
      />
   )
}

interface PriceValueProps {
   readonly initialMinPrice: number;
   readonly initialMaxPrice: number;
}

export function PriceInputFields({ initialMinPrice, initialMaxPrice }: PriceValueProps ) {
   const router = useRouter()
   const pathname = usePathname()
   const searchParams = useSearchParams()

   const [minPrice, setMinPrice] = React.useState(undefined)
   const [maxPrice, setMaxPrice] = React.useState(undefined)

   useEffect(() => {
      if (!isNaN(initialMinPrice)) setMinPrice(initialMinPrice)
      if (!isNaN(initialMaxPrice)) setMaxPrice(initialMaxPrice)
    }, [initialMinPrice, initialMaxPrice])

   const handleApply = () => {
      const current = new URLSearchParams(Array.from(searchParams.entries()))

      current.set('minPrice', minPrice.toString())
      current.set('maxPrice', maxPrice.toString())

      const search = current.toString()
      const query = search ? `?${search}` : ''

      router.replace(`${pathname}${query}`, {
         scroll: false,
      })
   }

   return (
      <div className="flex items-center gap-2 w-full">
         <Input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(parseFloat(e.target.value))}
            className="w-full focus-visible"
         />

         <Input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(parseFloat(e.target.value))}
            className="w-full focus-visible"
         />

         <Button 
            variant="outline" 
            onClick={handleApply} 
            className="whitespace-nowrap"
         >
            Apply
         </Button>
      </div>
   )
}