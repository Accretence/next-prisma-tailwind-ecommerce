'use client'

import { Spinner } from '@/components/native/icons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from '@/components/ui/card'
import { useAuthenticated } from '@/hooks/useAuthentication'
import { getCountInCart, getLocalCart, writeLocalCart } from '@/lib/cart'
import { useCartContext } from '@/state/Cart'
import { MinusIcon, PlusIcon, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export const Item = ({ cartItem }) => {
   const { authenticated } = useAuthenticated()
   const { loading, cart, refreshCart, dispatchCart } = useCartContext()
   const [fetchingCart, setFetchingCart] = useState(false)

   const { product, productId, count } = cartItem

   function findLocalCartIndexById(cart, productId) {
      const cart_items = cart?.items || [];

      for (let i = 0; i < cart_items.length; i++) {
         if (cart_items[i]?.productId === productId) {
            return i
         }
      }

      return -1
   }

   async function getProduct() {
      try {
         const response = await fetch(`/api/product`, {
            method: 'POST',
            body: JSON.stringify({ productId }),
            cache: 'no-store',
            headers: {
               'Content-Type': 'application/json-string',
            },
         })

         return await response.json()
      } catch (error) {
         console.error({ error })
      }
   }

   async function onAddToCart() {
      try {
         setFetchingCart(true)

         if (authenticated) {
            const response = await fetch(`/api/cart`, {
               method: 'POST',
               body: JSON.stringify({
                  productId,
                  count:
                     getCountInCart({ cartItems: cart?.items, productId }) + 1,
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

         if (
            !authenticated &&
            getCountInCart({ cartItems: cart?.items, productId }) > 0
         ) {
            for (let i = 0; i < localCart.items.length; i++) {
               if (localCart.items[i].productId === productId) {
                  localCart.items[i].count = localCart.items[i].count + 1
               }
            }

            dispatchCart(localCart)
         }

         if (
            !authenticated &&
            getCountInCart({ cartItems: cart?.items, productId }) < 1
         ) {
            localCart.items.push({
               productId,
               product: await getProduct(),
               count: 1,
            })

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

         if (authenticated) {
            const response = await fetch(`/api/cart`, {
               method: 'POST',
               body: JSON.stringify({
                  productId,
                  count:
                     getCountInCart({ cartItems: cart?.items, productId }) - 1,
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
         const index = findLocalCartIndexById(localCart, productId)

         if (
            !authenticated &&
            getCountInCart({ cartItems: cart?.items, productId }) > 1
         ) {
            for (let i = 0; i < localCart.items.length; i++) {
               if (localCart.items[i].productId === product?.id) {
                  localCart.items[i].count = localCart.items[i].count - 1
               }
            }

            dispatchCart(localCart)
         }

         if (
            !authenticated &&
            getCountInCart({ cartItems: cart?.items, productId }) === 1
         ) {
            localCart.items.splice(index, 1)

            dispatchCart(localCart)
         }

         setFetchingCart(false)
      } catch (error) {
         console.error({ error })
      }
   }

   function CartButton() {
      const count = getCountInCart({
         cartItems: cart?.items,
         productId,
      })

      if (fetchingCart)
         return (
            <Button disabled>
               <Spinner />
            </Button>
         )

      if (count === 0) {
         return <Button onClick={onAddToCart}>🛒 Add to Cart</Button>
      }

      if (count > 0) {
         return (
            <>
               <Button variant="outline" size="icon" onClick={onRemoveFromCart}>
                  {count === 1 ? (
                     <X className="h-4" />
                  ) : (
                     <MinusIcon className="h-4" />
                  )}
               </Button>
               <Button disabled variant="ghost" size="icon">
                  {count}
               </Button>
               <Button
                  disabled={productId == ''}
                  variant="outline"
                  size="icon"
                  onClick={onAddToCart}
               >
                  <PlusIcon className="h-4" />
               </Button>
            </>
         )
      }
   }

   function Price() {
      if (product?.discount > 0) {
         const price = product?.price - product?.discount
         const percentage = (product?.discount / product?.price) * 100
         return (
            <div className="flex gap-2 items-center">
               <Badge className="flex gap-4" variant="destructive">
                  <div className="line-through">${product?.price}</div>
                  <div>%{percentage.toFixed(2)}</div>
               </Badge>
               <h2 className="">${price.toFixed(2)}</h2>
            </div>
         )
      }

      return <h2>${product?.price}</h2>
   }
   return (
      <Card>
         <CardHeader className="p-0 md:hidden">
            <div className="relative h-32 w-full">
               <Link href={`/products/${product?.id}`}>
                  <Image
                     className="rounded-t-lg"
                     src={product?.images[0]}
                     alt="product image"
                     fill
                     sizes="(min-width: 1000px) 30vw, 50vw"
                     style={{ objectFit: 'cover' }}
                  />
               </Link>
            </div>
         </CardHeader>
         <CardContent className="grid grid-cols-6 gap-4 p-3">
            <div className="relative w-full col-span-2 hidden md:inline-flex">
               <Link href={`/products/${product?.id}`}>
                  <Image
                     className="rounded-lg"
                     src={product?.images[0]}
                     alt="item image"
                     fill
                     style={{ objectFit: 'cover' }}
                  />
               </Link>
            </div>
            <div className="col-span-4 block space-y-2">
               <Link href={`/products/${product?.id}`}>
                  <h2>{product?.title}</h2>
               </Link>
               <p className="text-xs text-muted-foreground text-justify">
                  {product?.description}
               </p>
               <Price />
               <CartButton />
            </div>
         </CardContent>
      </Card>
   )
}
