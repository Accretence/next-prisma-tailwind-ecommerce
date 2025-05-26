import { ModalProvider } from '@/providers/modal-provider'
import { ThemeProvider } from '@/providers/theme-provider'
import { ToastProvider } from '@/providers/toast-provider'
import { Inter } from 'next/font/google'

import './globals.css'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
   title: 'Store',
   description: 'E-Commerce Store',
   keywords: ['E-Commerce', 'Store', 'Shop'],
   authors: [{ name: 'Sesto', url: 'https://github.com/sesto-dev' }],
   creator: 'Sesto',
   publisher: 'Sesto',
}

export default async function RootLayout({
   children,
}: {
   children: React.ReactNode
}) {
   return (
      <html lang="en">
         <body className={inter.className}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
               <ToastProvider />
               <Toaster />
               <ModalProvider />
               {children}
            </ThemeProvider>
         </body>
      </html>
   )
}
