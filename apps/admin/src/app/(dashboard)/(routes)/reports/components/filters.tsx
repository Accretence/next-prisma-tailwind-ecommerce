'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { ChevronsUpDown, Check } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'
import { cn } from '@/lib/utils'
import { useReportsLoading } from './loading-context'

export default function Filters({ brands, categories, initial }) {
   const router = useRouter()
   const pathname = usePathname()
   const searchParams = useSearchParams()

   const [from, setFrom] = React.useState(initial?.from || '')
   const [to, setTo] = React.useState(initial?.to || '')
   const [brand, setBrand] = React.useState(initial?.brand || '')
   const [cats, setCats] = React.useState<string[]>(initial?.categories || [])
   const [openBrand, setOpenBrand] = React.useState(false)
   const [openCats, setOpenCats] = React.useState(false)
   const { isPending: pending, setPending } = useReportsLoading()

   const apply = () => {
      const params = new URLSearchParams(Array.from(searchParams.entries()))
      if (from) params.set('from', from); else params.delete('from')
      if (to) params.set('to', to); else params.delete('to')
      if (brand) params.set('brand', brand); else params.delete('brand')
      if (cats.length) params.set('categories', cats.join(',')); else params.delete('categories')
      const next = params.toString()
      const current = searchParams.toString()
      const url = `${pathname}${next ? `?${next}` : ''}`
      setPending(true)
      if (next === current) router.refresh()
      else router.replace(url, { scroll: false })
   }

   const toggleCat = (title: string) => {
      setCats((prev) => prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title])
   }

   return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
         <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
         <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />

         <Popover open={openBrand} onOpenChange={setOpenBrand}>
            <PopoverTrigger asChild>
               <Button variant="outline" className="justify-between">
                  {brand || 'Select brand...'}
                  <ChevronsUpDown className="ml-2 h-4 shrink-0 opacity-50" />
               </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[260px] p-0">
               <Command>
                  <CommandInput placeholder="Search brand..." />
                  <CommandList>
                     <CommandEmpty>No brand found.</CommandEmpty>
                     <CommandGroup>
                        {brands.map((b) => (
                           <CommandItem key={b.title} value={b.title} onSelect={(v) => {
                              setBrand(brand === b.title ? '' : b.title)
                              setOpenBrand(false)
                           }}>
                              <Check className={cn('mr-2 h-4', brand === b.title ? 'opacity-100' : 'opacity-0')} />
                              {b.title}
                           </CommandItem>
                        ))}
                     </CommandGroup>
                  </CommandList>
               </Command>
            </PopoverContent>
         </Popover>

         <Popover open={openCats} onOpenChange={setOpenCats}>
            <PopoverTrigger asChild>
               <Button variant="outline" className="justify-between">
                  {cats.length ? `${cats.length} categories` : 'Select categories...'}
                  <ChevronsUpDown className="ml-2 h-4 shrink-0 opacity-50" />
               </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[260px] p-0">
               <Command>
                  <CommandInput placeholder="Search category..." />
                  <CommandList>
                     <CommandEmpty>No category found.</CommandEmpty>
                     <CommandGroup>
                        {categories.map((c) => (
                           <CommandItem key={c.title} value={c.title} onSelect={() => toggleCat(c.title)}>
                              <Check className={cn('mr-2 h-4', cats.includes(c.title) ? 'opacity-100' : 'opacity-0')} />
                              {c.title}
                           </CommandItem>
                        ))}
                     </CommandGroup>
                  </CommandList>
               </Command>
            </PopoverContent>
         </Popover>

         <div className="flex gap-2">
            <Button onClick={apply} disabled={pending}>{pending ? 'Applying…' : 'Apply'}</Button>
            <Button
               variant="secondary"
               onClick={() => {
                  setFrom(''); setTo(''); setBrand(''); setCats([])
                  // Force navigation to base path even if already there
                  router.replace(pathname, { scroll: false })
                  router.refresh()
               }}
            >
               Reset
            </Button>
         </div>
      </div>
   )
}


