import { MainNav } from '@/components/main-nav'
import { ThemeToggle } from '@/components/theme-toggle'
import Link from 'next/link'

import { LogoutButton } from './logout-button'

export default async function Navbar() {
   return (
      <div className="border-b flex justify-between h-16 items-center px-[1.4rem] md:px-[4rem] lg:px-[6rem] xl:px-[8rem] 2xl:px-[12rem]">
         <div className="flex gap-6">
            <Link href="/" className="font-bold tracking-wider">
               ADMIN
            </Link>
            <MainNav className="hidden lg:block" />
         </div>
         <div className="flex items-center gap-2">
            <ThemeToggle />
            <LogoutButton />
         </div>
      </div>
   )
}
