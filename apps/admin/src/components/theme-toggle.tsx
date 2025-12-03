'use client'

import { Button } from '@/components/ui/button'
import { MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import * as React from 'react'

export function ThemeToggle() {
   const { resolvedTheme, setTheme } = useTheme()
   const [mounted, setMounted] = React.useState(false)

   React.useEffect(() => {
      setMounted(true)
   }, [])

   const isDark = resolvedTheme === 'dark'

   return (
      <Button
         variant="outline"
         size="icon"
         onClick={() => setTheme(isDark ? 'light' : 'dark')}
         aria-label="Toggle theme"
      >
         {mounted ? (
            isDark ? (
               <SunIcon className="h-4" />
            ) : (
               <MoonIcon className="h-4" />
            )
         ) : (
            // preserve layout during hydration; hide icon until mounted
            <SunIcon className="h-4 opacity-0" aria-hidden />
         )}
      </Button>
   )
}
