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

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'

import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { format } from "date-fns"

import { cn } from '@/lib/utils'
import { slugify } from '@persepolis/slugify'
import { Check, ChevronsUpDown } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useState, useEffect } from 'react'

interface DateRangePickerProps {
    initialStartDate?: string
    initialEndDate?: string
}


export const DateRangePicker: React.FC<DateRangePickerProps> = ({
    initialStartDate,
    initialEndDate,
}) => {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [range, setRange] = React.useState<DateRange>({
        from: initialStartDate ? new Date(initialStartDate) : undefined,
        to: initialEndDate ? new Date(initialEndDate) : undefined,
    })

    const handleDateChange = (newRange: DateRange | undefined) => {
        if (!newRange) return
        setRange(newRange)

        const params = new URLSearchParams(searchParams)
        if (newRange.from && newRange.to) {
            params.set("startDate", newRange.from.toISOString())
            params.set("endDate", newRange.to.toISOString())
        } else {
            params.delete("startDate")
            params.delete("endDate")
        }

        router.push(`?${params.toString()}`)
    }

    const handleReset = () => {
        setRange({ from: undefined, to: undefined })
        const params = new URLSearchParams(searchParams)
        params.delete("startDate")
        params.delete("endDate")
        router.push(`?${params.toString()}`)
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {range?.from ? (
                        range?.to ? (
                            <>
                                {format(range.from, "MMM dd, yyyy")} -{" "}
                                {format(range.to, "MMM dd, yyyy")}
                            </>
                        ) : (
                            format(range.from, "MMM dd, yyyy")
                        )
                    ) : (
                        <span>Pick a date range</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3 space-y-3" align="start">
                <Calendar
                    mode="range"
                    selected={range}
                    onSelect={handleDateChange}
                    numberOfMonths={1}
                />
                {range?.from || range?.to ? (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-muted-foreground hover:text-foreground"
                        onClick={handleReset}
                    >
                        Reset Date Range
                    </Button>
                ) : null}
            </PopoverContent>
        </Popover>
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
