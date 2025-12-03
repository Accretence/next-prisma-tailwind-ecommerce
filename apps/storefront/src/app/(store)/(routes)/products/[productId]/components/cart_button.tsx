'use client'

import { Spinner } from '@/components/native/icons'
import { CartPopupContext } from '@/components/native/nav/cart-context-provider'
import { Button } from '@/components/ui/button'
import { useAuthenticated } from '@/hooks/useAuthentication'
import { getCountInCart, getLocalCart } from '@/lib/cart'
import { CartContextProvider, useCartContext } from '@/state/Cart'
import { ShoppingBasketIcon } from 'lucide-react'
import Link from 'next/link'
import { useContext, useState } from 'react'

import QuantityInputComponent from './quantity-input-component'

export default function CartButton({ product }) {
   return (
      <CartContextProvider>
         <ButtonComponent product={product} />
      </CartContextProvider>
   )
}

export function ButtonComponent({ product }) {
   const { authenticated } = useAuthenticated()
   const { cart, dispatchCart } = useCartContext()

   const [quantity, setQuantity] = useState(1)

   const { Popup: productPopup } = useContext(CartPopupContext)

   const [fetchingCart, setFetchingCart] = useState(false)

   function findLocalCartIndexById(array: any, productId: string) {
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
                  count: quantity + count,
               }),
               cache: 'no-store',
               headers: {
                  'Content-Type': 'application/json-string',
               },
            })

            productPopup({
               name: product.title,
               quantity,
               image: product.images[0],
               id: product.id,
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

            dispatchCart(localCart)
         }
         setQuantity(1)

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

   if (count > 0) {
      return (
         <Link href="/cart">
            <Button className="flex gap-2 relative">
               <div className="relative ">
                  <ShoppingBasketIcon className="h-4" />
                  {count > 0 ? (
                     <div className="absolute bottom-[50%] right-[-10%] text-xs">
                        {count}
                     </div>
                  ) : null}
               </div>
               View in Cart
            </Button>
         </Link>
      )
   }

   return (
      <>
         {count > 0 ? (
            <></>
         ) : (
            <>
               <QuantityInputComponent
                  quantity={quantity}
                  setQuantity={setQuantity}
                  maxValue={product.stock}
               />
               <Button className="flex gap-2 relative" onClick={onAddToCart}>
                  <div className="relative ">
                     <ShoppingBasketIcon className="h-4" />
                     {count > 0 ? (
                        <div className="absolute bottom-[50%] right-[-10%] text-xs">
                           {count}
                        </div>
                     ) : null}
                  </div>
                  Add to Cart
               </Button>
            </>
         )}
      </>
   )
}
