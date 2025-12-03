import Footer from '@/components/native/Footer'
import CartContextProvider from '@/components/native/nav/cart-context-provider'
import Header from '@/components/native/nav/parent'

export default async function DashboardLayout({
   children,
}: {
   children: React.ReactNode
}) {
   return (
      <main className="flex flex-col  min-h-screen">
         <CartContextProvider>
            <Header />
            <div className="flex-grow min-w-1 min-h-2 px-[1.4rem] md:px-[4rem] lg:px-[6rem] xl:px-[8rem] 2xl:px-[12rem]">
               {children}
            </div>
            <Footer />
         </CartContextProvider>
      </main>
   )
}
