import Navbar from '@/components/navbar'

export default async function DashboardLayout({
   children,
}: {
   children: React.ReactNode
}) {
   return (
      <main className="w-[100%] h-[100vh] flex flex-col">
         <Navbar />
         <div className="px-[1.4rem] md:px-[4rem] lg:px-[6rem] xl:px-[7rem] 2xl:px-[12rem] flex-grow flex flex-col">
            {children}
         </div>
      </main>
   )
}
