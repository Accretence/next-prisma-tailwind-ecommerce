'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'

export function MainNav({
   className,
   ...props
}: React.HTMLAttributes<HTMLElement>) {
   const pathname = usePathname()

   const routes = [
      {
         href: `/banners`,
         label: 'Banners',
         active: pathname.includes(`/banners`),
      },
      {
         href: `/categories`,
         label: 'Categories',
         active: pathname.includes(`/categories`),
      },
      {
         href: `/products`,
         label: 'Products',
         active: pathname.includes(`/products`),
      },
      {
         href: `/orders`,
         label: 'Orders',
         active: pathname.includes(`/orders`),
      },
      {
         href: `/reports`,
         label: 'Reports',
         active: pathname.includes(`/reports`),
      },
      {
         href: `/payments`,
         label: 'Payments',
         active: pathname.includes(`/payments`),
      },
      {
         href: `/users`,
         label: 'Users',
         active: pathname.includes(`/users`),
      },
      {
         href: `/brands`,
         label: 'Brands',
         active: pathname.includes(`/brands`),
      },
      {
         href: `/codes`,
         label: 'Codes',
         active: pathname.includes(`/codes`),
      },
   ]

   return (
      <nav
         className={cn('flex items-center space-x-4 lg:space-x-6', className)}
         {...props}
      >
         {routes.map((route) => (
            <Link
               key={route.href}
               href={route.href}
               className={cn(
                  'text-sm transition-colors hover:text-primary',
                  route.active
                     ? 'font-semibold'
                     : 'font-light text-muted-foreground'
               )}
            >
               {route.label}
            </Link>
         ))}
      </nav>
   )
}
