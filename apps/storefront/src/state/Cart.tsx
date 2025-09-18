import { getLocalCart, writeLocalCart } from '@/lib/cart'
import { isVariableValid } from '@/lib/utils'
import { useUserContext } from '@/state/User'
import React, { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext({
   cart: null,
   loading: true,
   refreshCart: () => {},
   dispatchCart: (object) => {},
})

export const useCartContext = () => {
   return useContext(CartContext)
}

export const CartContextProvider = ({ children }) => {
   const { refreshUser, user } = useUserContext()

   const [cart, setCart] = useState(null)
   const [loading, setLoading] = useState(true)

   const dispatchCart = async (cart) => {
      setCart(cart)
      writeLocalCart(cart)
   }

   const refreshCart = async () => {
      setLoading(true)

      if (isVariableValid(user)) {
         setCart(user?.cart)
         writeLocalCart(user?.cart)
      } else {
         const localCart = getLocalCart()
         setCart(localCart)
      }

      setLoading(false)
   }

   useEffect(() => {
      if (isVariableValid(user)) {
         setCart(user?.cart)
         writeLocalCart(user?.cart)
      } else {
         const localCart = getLocalCart()
         if (!localCart || !localCart.items) {
            const defaultCart = { items: [] }
            writeLocalCart(defaultCart)
            setCart(defaultCart)
         } else {
            setCart(localCart)
         }
      }

      setLoading(false)
   }, [user])

   return (
      <CartContext.Provider
         value={{ cart, loading, refreshCart, dispatchCart }}
      >
         {children}
      </CartContext.Provider>
   )
}
