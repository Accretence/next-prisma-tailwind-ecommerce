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
import { cn } from '@/lib/utils'
import { slugify } from '@persepolis/slugify'
import { format } from 'date-fns'
import { Check, ChevronsUpDown } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { DateRange } from 'react-day-picker'

interface DateRangePickerProps {
   readonly initialStartDate?: string
   readonly initialEndDate?: string
}

export function DateRangePicker({
   initialStartDate,
   initialEndDate,
}: DateRangePickerProps) {
   const router = useRouter()
   const pathname = usePathname()
   const searchParams = useSearchParams()

   const [date, setDate] = useState<DateRange>({
      from: initialStartDate ? new Date(initialStartDate) : undefined,
      to: initialEndDate ? new Date(initialEndDate) : undefined,
   })

   useEffect(() => {
      const current = new URLSearchParams(Array.from(searchParams.entries()))

      if (date?.from) current.set('startDate', date.from.toISOString())
      else current.delete('startDate')

      if (date?.to) current.set('endDate', date.to.toISOString())
      else current.delete('endDate')

      const search = current.toString()
      const query = search ? `?${search}` : ''

      router.replace(`${pathname}${query}`, {
         scroll: false,
      })
   }, [date])

   return (
      <Popover>
         <PopoverTrigger asChild>
            <Button variant="outline">
                {
                    date?.from
                        ? date.to
                        ? `${format(date.from, 'LLL dd, y')} - ${format(date.to, 'LLL dd, y')}`
                        : format(date.from, 'LLL dd, y')
                        : <span>Pick a date</span>
                }
            </Button>
         </PopoverTrigger>
         <PopoverContent className="w-auto p-0" align="start">
            <Calendar
               autoFocus
               mode="range"
               defaultMonth={date?.from}
               selected={date}
               onSelect={setDate}
               numberOfMonths={1}
            />
         </PopoverContent>
      </Popover>
   )
}

interface CategoriesComboboxProps {
   readonly categories: { title: string }[]
   readonly initialCategory?: string
}

export function CategoriesCombobox({
   categories,
   initialCategory,
}: CategoriesComboboxProps) {
   const router = useRouter()
   const pathname = usePathname()
   const searchParams = useSearchParams()

   const [open, setOpen] = useState(false)
   const [selected, setSelected] = useState<string[]>([])

   useEffect(() => {
      if (!initialCategory) return

      const initialSlugs = initialCategory.split(',').map((slug) => slug.trim())
      setSelected(initialSlugs)
   }, [initialCategory])

   const toggleSelection = (slug: string) => {
      const selectedCategories = selected.includes(slug)
         ? selected.filter((s) => s !== slug)
         : [...selected, slug]

      setSelected(selectedCategories)

      const current = new URLSearchParams(Array.from(searchParams.entries()))

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
         return `${first}, ${second}, +${rest.length} other${rest.length > 1 ? 's' : ''}`
      }

      return matched.join(', ')
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
               {selected.length ? getDisplayedTitle() : 'Select categories...'}
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
                           <CommandItem
                              key={cat.title}
                              onSelect={() => toggleSelection(slug)}
                           >
                              <Check
                                 className={cn(
                                    'mr-2 h-4 w-4',
                                    isSelected ? 'opacity-100' : 'opacity-0'
                                 )}
                              />
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

interface BrandComboboxProps {
   readonly brands: { title: string }[]
   readonly initialBrand?: string
}

export function BrandCombobox({ brands, initialBrand }: BrandComboboxProps) {
   const router = useRouter()
   const pathname = usePathname()
   const searchParams = useSearchParams()

   const [open, setOpen] = useState(false)
   const [value, setValue] = useState('')

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
