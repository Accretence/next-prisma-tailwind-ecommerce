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
