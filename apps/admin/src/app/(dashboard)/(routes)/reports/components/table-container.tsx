'use client'

import { useReportsLoading } from './loading-context'
import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function TableContainer({ children }) {
   const { isPending, setPending } = useReportsLoading()
   const sp = useSearchParams()

   useEffect(() => {
      setPending(false)
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [sp.toString()])
   if (!isPending) return children
   return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
         {[...Array(2)].map((_, idx) => (
            <div key={idx} className="border rounded-md p-4 animate-pulse">
               <div className="h-5 w-40 bg-neutral-200 dark:bg-neutral-800 rounded mb-4" />
               <div className="space-y-2">
                  {[...Array(6)].map((__, i) => (
                     <div key={i} className="h-4 w-full bg-neutral-200 dark:bg-neutral-800 rounded" />
                  ))}
               </div>
            </div>
         ))}
      </div>
   )
}


