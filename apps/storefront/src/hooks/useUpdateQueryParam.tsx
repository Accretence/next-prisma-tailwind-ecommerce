'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export function useUpdateQueryParam() {
   const router = useRouter()
   const pathname = usePathname()
   const searchParams = useSearchParams()
   function updateQuery(key: string, value?: string | null) {
      const current = new URLSearchParams(window.location.search)

      const cleaned = typeof value === 'string' ? value.trim() : (value ?? '')

      if (cleaned) {
         current.set(key, cleaned)
      } else {
         current.delete(key)
      }

      const search = current.toString()
      const query = search ? `?${search}` : ''

      router.replace(`${pathname}${query}`, { scroll: false })
   }

   function clearAllQueries() {
      // Navigate to pathname without any query string
      router.replace(pathname, { scroll: false })
   }
   function updateMany(updates: Record<string, string | null | undefined>) {
      const current = new URLSearchParams(searchParams.toString())

      for (const key in updates) {
         const raw = updates[key]
         const cleaned = typeof raw === 'string' ? raw.trim() : (raw ?? '')

         if (cleaned) {
            current.set(key, cleaned)
         } else {
            current.delete(key)
         }
      }

      const qs = current.toString()
      router.replace(`${pathname}${qs ? `?${qs}` : ''}`, { scroll: false })
   }

   return { updateQuery, clearAllQueries, updateMany }
}
