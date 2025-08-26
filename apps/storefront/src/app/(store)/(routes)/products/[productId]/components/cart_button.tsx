'use client'

import { Spinner } from '@/components/native/icons'
import { Button } from '@/components/ui/button'
import { useAuthenticated } from '@/hooks/useAuthentication'
import { getCountInCart, getLocalCart } from '@/lib/cart'
import { CartContextProvider, useCartContext } from '@/state/Cart'
import { MinusIcon, PlusIcon, ShoppingBasketIcon, X } from 'lucide-react'
import { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';

export default function CartButton({ product }) {
   return (
      <CartContextProvider>
         <ButtonComponent product={product} />
      </CartContextProvider>
   )
}

export function ButtonComponent({ product }) {
   const { authenticated } = useAuthenticated()
   const { loading, cart, refreshCart, dispatchCart } = useCartContext()

   const [fetchingCart, setFetchingCart] = useState(false)

   function findLocalCartIndexById(array, productId) {
      for (let i = 0; i < array.length; i++) {
         if (array?.items[i]?.productId === productId) {
            return i
         }
      }
      return -1
   }

   async function onAddToCart() {
      try {
         setFetchingCart(true)

         const count = getCountInCart({
            cartItems: cart?.items,
            productId: product?.id,
         })

         if (authenticated) {
            const response = await fetch(`/api/cart`, {
               method: 'POST',
               body: JSON.stringify({
                  productId: product?.id,
                  count:
                     getCountInCart({
                        cartItems: cart?.items,
                        productId: product?.id,
                     }) + 1,
               }),
               cache: 'no-store',
               headers: {
                  'Content-Type': 'application/json-string',
               },
            })

            const json = await response.json()

            dispatchCart(json)
         }

         const localCart = getLocalCart() as any

         if (!authenticated && count > 0) {
            for (let i = 0; i < localCart.items.length; i++) {
               if (localCart.items[i].productId === product?.id) {
                  localCart.items[i].count = localCart.items[i].count + 1
               }
            }

            dispatchCart(localCart)
         }

         if (!authenticated && count < 1) {
            localCart.items.push({
               productId: product?.id,
               product,
               count: 1,
            })

            toast.success(`${product.title} has been added to your cart.`)

            dispatchCart(localCart)
         }

         setFetchingCart(false)
      } catch (error) {
         console.error({ error })
      }
   }

   async function onRemoveFromCart() {
      try {
         setFetchingCart(true)

         const count = getCountInCart({
            cartItems: cart?.items,
            productId: product?.id,
         })

         if (authenticated) {
            const response = await fetch(`/api/cart`, {
               method: 'POST',
               body: JSON.stringify({
                  productId: product?.id,
                  count:
                     getCountInCart({
                        cartItems: cart?.items,
                        productId: product?.id,
                     }) - 1,
               }),
               cache: 'no-store',
               headers: {
                  'Content-Type': 'application/json-string',
               },
            })

            const json = await response.json()

            dispatchCart(json)
         }

         const localCart = getLocalCart() as any
         const index = findLocalCartIndexById(localCart, product?.id)

         if (!authenticated && count > 1) {
            for (let i = 0; i < localCart.items.length; i++) {
               if (localCart.items[i].productId === product?.id) {
                  localCart.items[i].count = localCart.items[i].count - 1
               }
            }

            dispatchCart(localCart)
         }

         if (!authenticated && count === 1) {
            localCart.items.splice(index, 1)

            dispatchCart(localCart)
         }

         setFetchingCart(false)
      } catch (error) {
         console.error({ error })
      }
   }

   if (fetchingCart)
      return (
         <Button disabled>
            <Spinner />
         </Button>
      )

   const count = getCountInCart({
      cartItems: cart?.items,
      productId: product?.id,
   })

   if (count === 0) {
      return (
         <Button className="flex gap-2" onClick={onAddToCart}>
            <ShoppingBasketIcon className="h-4" /> Add to Cart
         </Button>
      )
   }

   if (count > 0) {
      return (
         <>
            <Button variant="outline" size="icon" onClick={onRemoveFromCart}>
               {count == 1 ? (
                  <X className="h-4 w-4" />
               ) : (
                  <MinusIcon className="h-4 w-4" />
               )}
            </Button>

            <Button disabled variant="outline" size="icon">
               {count}
            </Button>
            <Button variant="outline" size="icon" onClick={onAddToCart}>
               <PlusIcon className="h-4 w-4" />
            </Button>
         </>
      )
   }
}
