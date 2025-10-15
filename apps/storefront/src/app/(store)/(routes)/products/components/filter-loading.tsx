'use client'

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'

type FilterLoadingContextType = {
   isPending: boolean
   setPending: (value: boolean) => void
}

const FilterLoadingContext = createContext<FilterLoadingContextType>({
   isPending: false,
   setPending: () => {},
})

export const useFilterLoading = () => useContext(FilterLoadingContext)

export function FilterLoadingProvider({ children }: { children: React.ReactNode }) {
   const [isPending, setIsPending] = useState(false)

   const setPending = useCallback((value: boolean) => setIsPending(value), [])

   const value = useMemo(
      () => ({ isPending, setPending }),
      [isPending, setPending]
   )

   return (
      <FilterLoadingContext.Provider value={value}>
         {children}
      </FilterLoadingContext.Provider>
   )
}


