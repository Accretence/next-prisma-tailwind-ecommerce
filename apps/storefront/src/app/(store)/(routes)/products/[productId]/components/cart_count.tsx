'use client'
import { ShoppingBasketIcon } from 'lucide-react'
import { getLocalCart } from '@/lib/cart'
import { useState, useEffect } from 'react'

export function CartCount() {
    const [cartCount, setCartCount] = useState<number>(0)

    function refreshCart() {
        const cart = getLocalCart()
        setCartCount(cart?.items?.length ?? 0)
    }

    useEffect(() => {
        refreshCart()
        window.addEventListener('cartUpdated', refreshCart)
        return () => window.removeEventListener('cartUpdated', refreshCart)
    }, [])

    return (
        <div className="relative inline-block">
        <ShoppingBasketIcon className="h-5 w-5" />
        { cartCount > 0 && (
            <span
                className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 
                        bg-red-500 text-white text-[10px] font-bold rounded-full 
                        h-3.5 w-3.5 flex items-center justify-center leading-none"
            >
                {cartCount}
            </span>
        )}
        </div>
    )
}
