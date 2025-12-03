'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import * as React from 'react'

function formatDateForDisplay(date: Date | undefined) {
   if (!date) return ''
   return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
   })
}

function parseToDate(value: string | Date | undefined) {
   if (!value) return undefined
   if (value instanceof Date) return value
   const d = new Date(value)
   return isNaN(d.getTime()) ? undefined : d
}

function isWithinRange(date: Date, min?: Date, max?: Date) {
   if (min && date < min) return false
   if (max && date > max) return false
   return true
}

export function DatePickerComponent({
   label,
   value,
   onChange,
   minDate,
   maxDate,
}: {
   label: string
   value?: string | Date
   onChange?: (date: Date | undefined) => void
   minDate?: string | Date
   maxDate?: string | Date
}) {
   const parsedDate = parseToDate(value)
   const min = parseToDate(minDate)
   const max = parseToDate(maxDate)

   const [open, setOpen] = React.useState(false)
   const [month, setMonth] = React.useState<Date | undefined>(parsedDate)

   return (
      <div className="flex flex-col gap-3">
         <Label htmlFor="date" className="px-1">
            {label}
         </Label>

         <div className="relative flex gap-2">
            <Input
               id="date"
               value={formatDateForDisplay(parsedDate)}
               placeholder="Select date..."
               className="bg-background pr-10"
               onChange={(e) => {
                  const raw = e.target.value
                  const d = new Date(raw)

                  if (isNaN(d.getTime()) || !isWithinRange(d, min, max)) {
                     onChange?.(undefined)
                     return
                  }

                  onChange?.(d)
               }}
               onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') {
                     e.preventDefault()
                     setOpen(true)
                  }
               }}
            />

            <Popover open={open} onOpenChange={setOpen}>
               <PopoverTrigger asChild>
                  <Button
                     variant="ghost"
                     className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                  >
                     <CalendarIcon className="size-3.5" />
                     <span className="sr-only">Select date</span>
                  </Button>
               </PopoverTrigger>

               <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="end"
                  alignOffset={-8}
                  sideOffset={10}
               >
                  <Calendar
                     mode="single"
                     selected={parsedDate}
                     captionLayout="dropdown"
                     month={month}
                     onMonthChange={setMonth}
                     disabled={[
                        { before: min ?? undefined },
                        { after: max ?? undefined },
                     ]}
                     onSelect={(d) => {
                        if (!d) {
                           onChange?.(undefined)
                           return
                        }
                        if (!isWithinRange(d, min, max)) return

                        onChange?.(d)
                        setOpen(false)
                     }}
                  />
               </PopoverContent>
            </Popover>
         </div>
      </div>
   )
}
