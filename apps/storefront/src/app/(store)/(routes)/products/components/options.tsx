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
import { Input } from '@/components/ui/input'
import { cn, isVariableValid } from '@/lib/utils'
import { slugify } from '@persepolis/slugify'
import { Check, ChevronsUpDown } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'
import { useFilterLoading } from './filter-loading'

export function SortBy({ initialData }) {
   const router = useRouter()
   const pathname = usePathname()
   const searchParams = useSearchParams()
   const { setPending } = useFilterLoading()

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
            setPending(true)
         }}
      >
         <SelectTrigger className="w-full">
            <SelectValue placeholder="Sort By" />
         </SelectTrigger>
         <SelectContent>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="most_expensive">Most Expensive</SelectItem>
            <SelectItem value="least_expensive">Least Expensive</SelectItem>
            <SelectItem value="title_asc">Title (A-Z)</SelectItem>
            <SelectItem value="title_desc">Title (Z-A)</SelectItem>
         </SelectContent>
      </Select>
   )
}

export function CategoriesCombobox({ categories, initialCategory }) {
   const router = useRouter()
   const pathname = usePathname()
   const searchParams = useSearchParams()
   const { setPending } = useFilterLoading()

   const [open, setOpen] = React.useState(false)
   const [value, setValue] = React.useState('')

   function getCategoryTitle() {
      for (const category of categories) {
         if (slugify(category.title) === slugify(value)) return category.title
      }
   }

   useEffect(() => {
      setValue(initialCategory ?? '')
   }, [initialCategory])

   return (
      <Popover open={open} onOpenChange={setOpen}>
         <PopoverTrigger asChild>
            <Button
               variant="outline"
               role="combobox"
               aria-expanded={open}
               className="w-full justify-between"
            >
               {value ? getCategoryTitle() : 'Select category...'}
               <ChevronsUpDown className="ml-2 h-4 shrink-0 opacity-50" />
            </Button>
         </PopoverTrigger>
         <PopoverContent className="w-full p-0">
            <Command>
               <CommandInput placeholder="Search category..." />
               <CommandList>
                  <CommandEmpty>No category found.</CommandEmpty>
                  <CommandGroup>
                  {categories.map((category) => (
                     <CommandItem
                        key={category.title}
                        value={category.title}
                        onSelect={(currentValue) => {
                           const current = new URLSearchParams(
                              Array.from(searchParams.entries())
                           )

                           const selectedTitle =
                              categories.find(
                                 (c) => slugify(c.title) === slugify(currentValue)
                              )?.title || currentValue

                           if (slugify(currentValue) === slugify(value)) {
                              current.delete('category')
                              setValue('')
                           } else {
                              current.set('category', selectedTitle)
                              setValue(selectedTitle)
                           }

                           // cast to string
                           const search = current.toString()
                           // or const query = `${'?'.repeat(search.length && 1)}${search}`;
                           const query = search ? `?${search}` : ''

                           router.replace(`${pathname}${query}`, {
                              scroll: false,
                           })

                           setOpen(false)
                           setPending(true)
                        }}
                        onMouseDown={(e) => {
                           e.preventDefault()
                           const currentValue = category.title
                           const current = new URLSearchParams(
                              Array.from(searchParams.entries())
                           )

                           const selectedTitle = category.title

                           if (slugify(currentValue) === slugify(value)) {
                              current.delete('category')
                              setValue('')
                           } else {
                              current.set('category', selectedTitle)
                              setValue(selectedTitle)
                           }

                           const search = current.toString()
                           const query = search ? `?${search}` : ''

                           router.replace(`${pathname}${query}`, {
                              scroll: false,
                           })

                           setOpen(false)
                           setPending(true)
                        }}
                     >
                        <Check
                           className={cn(
                              'mr-2 h-4 w-4',
                              slugify(value ?? '') === slugify(category.title)
                                 ? 'opacity-100'
                                 : 'opacity-0'
                           )}
                        />
                        {category.title}
                     </CommandItem>
                  ))}
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
   const { setPending } = useFilterLoading()

   const [open, setOpen] = React.useState(false)
   const [value, setValue] = React.useState('')

   function getBrandTitle() {
      for (const brand of brands) {
         if (slugify(brand.title) === slugify(value)) return brand.title
      }
   }

   useEffect(() => {
      setValue(initialBrand ?? '')
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
                        value={brand.title}
                        onSelect={(currentValue) => {
                           const current = new URLSearchParams(
                              Array.from(searchParams.entries())
                           )

                           const selectedTitle =
                              brands.find(
                                 (b) => slugify(b.title) === slugify(currentValue)
                              )?.title || currentValue

                           if (slugify(currentValue) === slugify(value)) {
                              current.delete('brand')
                              setValue('')
                           } else {
                              current.set('brand', selectedTitle)
                              setValue(selectedTitle)
                           }

                           // cast to string
                           const search = current.toString()
                           // or const query = `${'?'.repeat(search.length && 1)}${search}`;
                           const query = search ? `?${search}` : ''

                           router.replace(`${pathname}${query}`, {
                              scroll: false,
                           })

                           setOpen(false)
                           setPending(true)
                        }}
                        onMouseDown={(e) => {
                           e.preventDefault()
                           const currentValue = brand.title
                           const current = new URLSearchParams(
                              Array.from(searchParams.entries())
                           )

                           const selectedTitle = brand.title

                           if (slugify(currentValue) === slugify(value)) {
                              current.delete('brand')
                              setValue('')
                           } else {
                              current.set('brand', selectedTitle)
                              setValue(selectedTitle)
                           }

                           const search = current.toString()
                           const query = search ? `?${search}` : ''

                           router.replace(`${pathname}${query}`, {
                              scroll: false,
                           })

                           setOpen(false)
                           setPending(true)
                        }}
                     >
                        <Check
                           className={cn(
                              'mr-2 h-4',
                              slugify(value ?? '') === slugify(brand.title)
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
   const { setPending } = useFilterLoading()
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
                  setPending(true)
               }}
               id="available"
            />
            <Label htmlFor="available">Only Available</Label>
         </div>
      </div>
   )
}

export function TextSearch({ initialQuery }) {
   const router = useRouter()
   const pathname = usePathname()
   const searchParams = useSearchParams()
   const { setPending } = useFilterLoading()

   const [value, setValue] = React.useState('')

   useEffect(() => {
      setValue(initialQuery ?? '')
   }, [initialQuery])

   useEffect(() => {
      const handler = setTimeout(() => {
         const current = new URLSearchParams(Array.from(searchParams.entries()))

         if (value && value.trim().length > 0) {
            current.set('q', value)
         } else {
            current.delete('q')
         }

         const nextSearch = current.toString()
         const nextQuery = nextSearch ? `?${nextSearch}` : ''

         // Only navigate if q actually changed
         const currentQ = searchParams.get('q') || ''
         const nextQ = value || ''
         if (currentQ !== nextQ) {
            router.replace(`${pathname}${nextQuery}`, { scroll: false })
            setPending(true)
         }
      }, 300)

      return () => clearTimeout(handler)
   }, [value, router, pathname])

   return (
      <Input
         className="w-full"
         placeholder="Search products..."
         value={value}
         onChange={(e) => setValue(e.target.value)}
      />
   )
}

export function CategoriesMultiSelect({ categories, initialCategories }) {
   const router = useRouter()
   const pathname = usePathname()
   const searchParams = useSearchParams()
   const { setPending } = useFilterLoading()

   const [open, setOpen] = React.useState(false)
   const [selected, setSelected] = React.useState<string[]>([])

   useEffect(() => {
      if (Array.isArray(initialCategories)) {
         setSelected(initialCategories.filter(Boolean))
      } else if (typeof initialCategories === 'string' && initialCategories) {
         setSelected(
            initialCategories
               .split(',')
               .map((s) => s.trim())
               .filter(Boolean)
         )
      } else {
         setSelected([])
      }
   }, [initialCategories])

   const toggle = (title: string) => {
      const idx = selected.findIndex((t) => slugify(t ?? '') === slugify(title))
      const next = idx >= 0
         ? selected.filter((t) => slugify(t) !== slugify(title))
         : [...selected, title]

      setSelected(next)

      const current = new URLSearchParams(Array.from(searchParams.entries()))
      if (next.length === 0) {
         current.delete('categories')
         current.delete('category')
      } else {
         current.set('categories', next.join(','))
         current.delete('category')
      }

      const search = current.toString()
      const query = search ? `?${search}` : ''
      router.replace(`${pathname}${query}`, { scroll: false })
      setPending(true)
   }

   const buttonLabel = (() => {
      if (selected.length === 0) return 'Select categories...'
      if (selected.length === 1) return selected[0]
      return `${selected.length} categories`
   })()

   return (
      <Popover open={open} onOpenChange={setOpen}>
         <PopoverTrigger asChild>
            <Button
               variant="outline"
               role="combobox"
               aria-expanded={open}
               className="w-full justify-between"
            >
               {buttonLabel}
               <ChevronsUpDown className="ml-2 h-4 shrink-0 opacity-50" />
            </Button>
         </PopoverTrigger>
         <PopoverContent className="w-full p-0">
            <Command>
               <CommandInput placeholder="Search categories..." />
               <CommandList>
                  <CommandEmpty>No category found.</CommandEmpty>
                  <CommandGroup>
                  {categories.map((category) => {
                     const checked = selected.some(
                        (t) => slugify(t ?? '') === slugify(category.title)
                     )
                     return (
                        <CommandItem
                           key={category.title}
                           value={category.title}
                           onSelect={() => toggle(category.title)}
                           onMouseDown={(e) => {
                              e.preventDefault()
                              toggle(category.title)
                           }}
                        >
                           <Check
                              className={cn(
                                 'mr-2 h-4 w-4',
                                 checked ? 'opacity-100' : 'opacity-0'
                              )}
                           />
                           {category.title}
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

export function PriceRange({ initialMin, initialMax }) {
   const router = useRouter()
   const pathname = usePathname()
   const searchParams = useSearchParams()
    const { setPending } = useFilterLoading()

   const [min, setMin] = React.useState<string>('')
   const [max, setMax] = React.useState<string>('')

   useEffect(() => {
      setMin(initialMin ?? '')
   }, [initialMin])

   useEffect(() => {
      setMax(initialMax ?? '')
   }, [initialMax])

   useEffect(() => {
      const handler = setTimeout(() => {
         const current = new URLSearchParams(Array.from(searchParams.entries()))

         if (min && min !== '') current.set('minPrice', min)
         else current.delete('minPrice')

         if (max && max !== '') current.set('maxPrice', max)
         else current.delete('maxPrice')

         const nextSearch = current.toString()
         const nextQuery = nextSearch ? `?${nextSearch}` : ''

         const currentMin = searchParams.get('minPrice') || ''
         const currentMax = searchParams.get('maxPrice') || ''
         const nextMin = min || ''
         const nextMax = max || ''

         if (currentMin !== nextMin || currentMax !== nextMax) {
            router.replace(`${pathname}${nextQuery}`, { scroll: false })
            setPending(true)
         }
      }, 300)

      return () => clearTimeout(handler)
   }, [min, max, router, pathname])

   return (
      <div className="flex gap-2 w-full">
         <Input
            type="number"
            min={0}
            placeholder="Min price"
            value={min}
            onChange={(e) => setMin(e.target.value)}
         />
         <Input
            type="number"
            min={0}
            placeholder="Max price"
            value={max}
            onChange={(e) => setMax(e.target.value)}
         />
      </div>
   )
}
