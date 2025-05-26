'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
   Command,
   CommandEmpty,
   CommandGroup,
   CommandInput,
   CommandItem,
   CommandList,
} from '@/components/ui/command'
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from '@/components/ui/popover'
import { cn, isVariableValid } from '@/lib/utils'
import { slugify } from '@persepolis/slugify'
import { format } from 'date-fns'
import { Check, ChevronsUpDown } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'
import { DateRange } from 'react-day-picker'

export function DateRangePicker({ initialFrom, initialTo }) {
   const router = useRouter()
   const pathname = usePathname()
   const searchParams = useSearchParams()

   const [date, setDate] = React.useState<DateRange>({
      from: initialFrom ? new Date(initialFrom) : undefined,
      to: initialTo ? new Date(initialTo) : undefined,
   })

   useEffect(() => {
      const current = new URLSearchParams(Array.from(searchParams.entries()))

      if (date?.from) current.set('from', date.from.toISOString())
      else current.delete('from')

      if (date?.to) current.set('to', date.to.toISOString())
      else current.delete('to')

      const search = current.toString()
      const query = search ? `?${search}` : ''

      router.replace(`${pathname}${query}`, {
         scroll: false,
      })
   }, [date])

   const buttonText = date?.from
      ? date?.to
         ? `${format(date.from, 'LLL dd, y')} - ${format(date.to, 'LLL dd, y')}`
         : `${format(date.from, 'LLL dd, y')}`
      : 'Pick a date'

   return (
      <Popover>
         <PopoverTrigger asChild>
            <Button
               id="date"
               variant="outline"
               className={cn(
                  'w-full justify-start text-left font-normal',
                  !date && 'text-muted-foreground'
               )}
            >
               {buttonText}
            </Button>
         </PopoverTrigger>
         <PopoverContent className="w-auto p-0" align="start">
            <Calendar
               initialFocus
               mode="range"
               defaultMonth={date?.from}
               selected={date}
               onSelect={setDate}
               numberOfMonths={2}
            />
         </PopoverContent>
      </Popover>
   )
}

export function CategoriesCombobox({ categories, initialCategory }) {
   const router = useRouter()
   const pathname = usePathname()
   const searchParams = useSearchParams()

   const [open, setOpen] = React.useState(false)
   const [selectedCategories, setSelectedCategories] = React.useState([])

   useEffect(() => {
      if (initialCategory) {
         const initial = Array.isArray(initialCategory)
            ? initialCategory
            : initialCategory.split(',')
         setSelectedCategories(initial)
      }
   }, [initialCategory])

   function toggleCategory(value) {
      setSelectedCategories((prev) =>
         prev.includes(value)
            ? prev.filter((c) => c !== value)
            : [...prev, value]
      )
   }

   useEffect(() => {
      const current = new URLSearchParams(Array.from(searchParams.entries()))

      if (selectedCategories.length > 0) {
         current.set('category', selectedCategories.join(','))
      } else {
         current.delete('category')
      }

      const search = current.toString()
      const query = search ? `?${search}` : ''

      router.replace(`${pathname}${query}`, {
         scroll: false,
      })
   }, [selectedCategories])

   return (
      <Popover open={open} onOpenChange={setOpen}>
         <PopoverTrigger asChild>
            <Button
               variant="outline"
               role="combobox"
               aria-expanded={open}
               className="w-full justify-between"
            >
               {selectedCategories.length > 0
                  ? `${selectedCategories.length} categor${selectedCategories.length > 1 ? 'ies' : 'y'} selected`
                  : 'Select categories...'}
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
                           onSelect={() => toggleCategory(category.title)}
                        >
                           <Check
                              className={`mr-2 h-4 w-4 ${
                                 selectedCategories.includes(category.title)
                                    ? 'opacity-100'
                                    : 'opacity-0'
                              }`}
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

   const [open, setOpen] = React.useState(false)
   const [value, setValue] = React.useState('')

   function getBrandTitle() {
      for (const brand of brands) {
         if (slugify(brand.title) === slugify(value)) return brand.title
      }
   }

   useEffect(() => {
      if (isVariableValid(initialBrand)) setValue(initialBrand)
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
