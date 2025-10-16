'use client'

import { createContext, useContext, useState } from 'react'

interface FilterResetContextType {
    resetSignal: number
    triggerReset: () => void
}

const FilterResetContext = createContext<FilterResetContextType | undefined>(undefined)

export function FilterResetProvider({ children }: { children: React.ReactNode }) {
    const [resetSignal, setResetSignal] = useState(0)

    const triggerReset = () => {
        setResetSignal(prev => prev + 1)
    }

    return (
        <FilterResetContext.Provider value={{ resetSignal, triggerReset }}>
            {children}
        </FilterResetContext.Provider>
    )
}

export function useFilterReset() {
    const context = useContext(FilterResetContext)
    if (!context) throw new Error('useFilterReset must be used within FilterResetProvider')
    return context
}