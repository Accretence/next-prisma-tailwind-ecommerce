'use client'

// Components
import { Button } from '@/components/ui/button'
import {
   Command,
   CommandEmpty,
   CommandGroup,
   CommandInput,
   CommandItem,
   CommandList,
} from '@/components/ui/command'
import { DatePickerComponent } from '@/components/ui/date-picker'
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from '@/components/ui/popover'
import { useDebounce } from '@/hooks/use-debounce'
import { useUpdateQueryParam } from '@/hooks/use-update-query-param'
// utils
import { cn, isVariableValid } from '@/lib/utils'
import { slugify } from '@persepolis/slugify'
import { format } from 'date-fns'
// Icons
import { Check, ChevronsUpDown } from 'lucide-react'
import React, { useEffect } from 'react'


export function CategoriesCombobox({ categories, initialCategory }) {
   const [open, setOpen] = React.useState(false)
   const [value, setValue] = React.useState<string[]>([])
   const { updateMany } = useUpdateQueryParam()

   const valueDebounce = useDebounce(value, 500)

   const firstMount = React.useRef(true)
   const initialValueRef = React.useRef(value)

   useEffect(() => {
      if (firstMount.current) {
         firstMount.current = false
         initialValueRef.current = valueDebounce
         return
      }

      // Only update if the value has actually changed
      if (
         JSON.stringify(initialValueRef.current) !==
         JSON.stringify(valueDebounce)
      ) {
         updateMany({
            category: valueDebounce.join('+'),
            page: '1',
         })
         initialValueRef.current = valueDebounce
      }
   }, [valueDebounce, updateMany])

   function getCategoryTitle() {
      const selectedCategories = categories.filter((category) =>
         value.includes(slugify(category.title))
      )
      return selectedCategories.map((cat) => cat.title).join(', ')
   }

   function toggleListItem(slug: string) {
      let updatedList = [...value]
      if (updatedList.includes(slug)) {
         updatedList = updatedList.filter((item) => item !== slug)
      } else {
         updatedList.push(slug)
      }
      setValue(updatedList)
   }

   useEffect(() => {
      if (!initialCategory) return

      const initialSlugs = initialCategory
         .split('+')
         .map((title) => slugify(title))

      setValue(initialSlugs)
   }, [initialCategory])

   return (
      <Popover open={open} onOpenChange={setOpen}>
         <PopoverTrigger asChild>
            <Button
               variant="outline"
               role="combobox"
               aria-expanded={open}
               className="w-full flex justify-between overflow-hidden "
            >
               <span className="max-w-[400px] truncate">
                  {value.length > 0 ? getCategoryTitle() : 'Select category...'}
               </span>
               <ChevronsUpDown className="ml-2 h-4 shrink-0 opacity-50" />
            </Button>
         </PopoverTrigger>
         <PopoverContent className="w-full p-0 ">
            <Command>
               <CommandInput placeholder="Search category..." />
               <CommandList>
                  <CommandEmpty>No category found.</CommandEmpty>
                  {categories.map((category) => {
                     const slug = slugify(category.title)
                     const isSelected = value.includes(slug)
                     return (
                        <CommandItem
                           key={category.title}
                           value={category.title}
                           onSelect={() => {
                              toggleListItem(slug)
                           }}
                           className={`flex align-start content-start hover:opacity-100 cursor-pointer ${isSelected ? 'opacity-100' : 'opacity-50'}`}
                        >
                           <Check
                              className={cn(
                                 'mr-2 h-4 w-4',
                                 isSelected ? 'opacity-100' : 'opacity-0'
                              )}
                           />
                           {category.title}
                        </CommandItem>
                     )
                  })}
               </CommandList>
            </Command>
         </PopoverContent>
      </Popover>
   )
}

export function BrandCombobox({ brands, initialValue }) {
   const [open, setOpen] = React.useState(false)
   const [value, setValue] = React.useState(initialValue)

   const { updateMany } = useUpdateQueryParam()
   const debounceValue = useDebounce(value, 500)

   const firstMount = React.useRef(true)
   const initialValueRef = React.useRef(value)

   useEffect(() => {
      if (firstMount.current) {
         firstMount.current = false
         initialValueRef.current = debounceValue
         return
      }

      // Only update if the value has actually changed
      if (initialValueRef.current !== debounceValue) {
         updateMany({
            brand: debounceValue,
            page: '1',
         })
         initialValueRef.current = debounceValue
      }
   }, [debounceValue, updateMany])

   function getBrandTitle() {
      for (const brand of brands) {
         if (brand.id === value) return brand.title
      }
   }

   return (
      <>
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
                        {brands.map((brand) => {
                           const isSelected = value === brand.id
                           return (
                              <CommandItem
                                 key={brand.title}
                                 value={brand.title}
                                 onSelect={() => {
                                    if (value !== brand.id) {
                                       setValue(brand.id)
                                    } else {
                                       setValue('')
                                    }

                                    setOpen(false)
                                 }}
                                 className={`flex align-start content-start hover:opacity-100 cursor-pointer ${isSelected ? 'opacity-100' : 'opacity-50'}`}
                              >
                                 <Check
                                    className={cn(
                                       'mr-2 h-4',
                                       isSelected ? 'opacity-100' : 'opacity-0'
                                    )}
                                 />
                                 {brand.title}
                              </CommandItem>
                           )
                        })}
                     </CommandGroup>
                  </CommandList>
               </Command>
            </PopoverContent>
         </Popover>
      </>
   )
}

export function DateRange({ from, to }) {
   const [fromValue, setFromValue] = React.useState(from)
   const [toValue, setToValue] = React.useState(to)

   const { updateMany } = useUpdateQueryParam()
   const debouncedFromValue = useDebounce(fromValue, 500)
   const debouncedToValue = useDebounce(toValue, 500)

   const firstMountFrom = React.useRef(true)
   const firstMountTo = React.useRef(true)
   const initialFromRef = React.useRef(fromValue)
   const initialToRef = React.useRef(toValue)

   useEffect(() => {
      if (firstMountFrom.current) {
         firstMountFrom.current = false
         initialFromRef.current = debouncedFromValue
         return
      }

      if (initialFromRef.current !== debouncedFromValue) {
         if (debouncedFromValue && isVariableValid(debouncedFromValue)) {
            const formattedFromDate = format(
               new Date(debouncedFromValue),
               'yyyy-MM-dd'
            )
            updateMany({
               startDate: formattedFromDate,
               page: '1',
            })
         } else {
            updateMany({
               startDate: '',
               page: '1',
            })
         }
         initialFromRef.current = debouncedFromValue
      }
   }, [debouncedFromValue, updateMany])

   useEffect(() => {
      if (firstMountTo.current) {
         firstMountTo.current = false
         initialToRef.current = debouncedToValue
         return
      }

      if (initialToRef.current !== debouncedToValue) {
         if (debouncedToValue && isVariableValid(debouncedToValue)) {
            const formattedToDate = format(
               new Date(debouncedToValue),
               'yyyy-MM-dd'
            )
            updateMany({
               endDate: formattedToDate,
               page: '1',
            })
         } else {
            updateMany({
               endDate: '',
               page: '1',
            })
         }
         initialToRef.current = debouncedToValue
      }
   }, [debouncedToValue, updateMany])

   return (
      <div className="flex items-end space-x-2">
         <DatePickerComponent
            label="From"
            value={fromValue}
            onChange={(date) => setFromValue(date)}
            maxDate={toValue}
         />
         <div className="pb-2">-</div>
         <DatePickerComponent
            label="To"
            value={toValue}
            onChange={(date) => setToValue(date)}
            minDate={fromValue}
         />
      </div>
   )
}
