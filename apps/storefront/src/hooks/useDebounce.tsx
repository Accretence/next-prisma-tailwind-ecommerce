import { useEffect, useState } from 'react'

/**
 * @description Custom hook to debounce a value after a specified delay.
 *
 * @param value - The value to be debounced.
 * @param delay - The delay in milliseconds before updating the debounced value. Default is 300ms.
 *
 * @example
 * const debouncedSearchTerm = useDebounce(searchTerm, 500);
 *
 * @author Harold
 * @since 11-22-2025
 * @returns The debounced value.
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
   const [debouncedValue, setDebouncedValue] = useState(value)

   useEffect(() => {
      const timer = setTimeout(() => {
         setDebouncedValue(value)
      }, delay)

      return () => {
         clearTimeout(timer)
      }
   }, [value, delay])

   return debouncedValue
}



/**
 * @description Debounce function to limit the rate at which a function can fire.
 * 
 * @param fn - The function to be debounced.
 * @param delay - The delay in milliseconds before the function can be called again. Default is 300ms.
 * @example
 * const debouncedFunction = debounce(() => { console.log('Debounced!') }, 500);
 * 
 * @author Harold
 * @since 12-3-2025
 * @returns A debounced version of the input function.
 */
export function debounce<F extends (...args: any[]) => void>(
   fn: F,
   delay = 300
) {
   let timer: ReturnType<typeof setTimeout>

   return function (this: any, ...args: Parameters<F>) {
      clearTimeout(timer)
      timer = setTimeout(() => {
         fn.apply(this, args)
      }, delay)
   }
}
