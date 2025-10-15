'use client'

import React, { createContext, useContext, useMemo, useState, useCallback } from 'react'

type ReportsLoadingContextType = {
   isPending: boolean
   setPending: (v: boolean) => void
}

const ReportsLoadingContext = createContext<ReportsLoadingContextType>({
   isPending: false,
   setPending: () => {},
})

export function useReportsLoading() {
   return useContext(ReportsLoadingContext)
}

export function ReportsLoadingProvider({ children }: { children: React.ReactNode }) {
   const [isPending, setIsPending] = useState(false)
   const setPending = useCallback((v: boolean) => setIsPending(v), [])
   const value = useMemo(() => ({ isPending, setPending }), [isPending, setPending])
   return <ReportsLoadingContext.Provider value={value}>{children}</ReportsLoadingContext.Provider>
}


