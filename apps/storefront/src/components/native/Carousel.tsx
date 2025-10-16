'use client'

import { cn } from '@/lib/utils'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function Carousel({ images }: { images: string[] }) {
   const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay()])

   const [selectedIndex, setSelectedIndex] = useState(0)

   useEffect(() => {
      function selectHandler() {
         const index = emblaApi?.selectedScrollSnap()
         setSelectedIndex(index || 0)
      }

      emblaApi?.on('select', selectHandler)

      return () => {
         emblaApi?.off('select', selectHandler)
      }
   }, [emblaApi])

   return (
      <>
         <div className="overflow-hidden rounded-lg w-full h-full" ref={emblaRef}>
            <div className="flex w-full h-full">
               {images.map((src, i) => (
                  <div className="relative w-full h-full flex-shrink-0" key={i}>
                     <Image src={src} fill className="object-cover" alt="" />
                  </div>
               ))}
            </div>
         </div>
         <Dots itemsLength={images.length} selectedIndex={selectedIndex} />
      </>
   )
}

type Props = {
   itemsLength: number
   selectedIndex: number
}
const Dots = ({ itemsLength, selectedIndex }: Props) => {
   const arr = new Array(itemsLength).fill(0)
   return (
      <div className="flex gap-1 justify-center -translate-y-8">
         {arr.map((_, index) => {
            const selected = index === selectedIndex
            return (
               <div
                  className={cn({
                     'h-3 w-3 rounded-full transition-all duration-300 bg-primary-foreground':
                        true,
                     // tune down the opacity if slide is not selected
                     'h-3 w-3 opacity-50': !selected,
                  })}
                  key={index}
               />
            )
         })}
      </div>
   )
}
