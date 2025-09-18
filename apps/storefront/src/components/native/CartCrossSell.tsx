'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Heart, Eye } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useCartContext } from '@/state/Cart'

interface Product {
   id: string
   title: string
   description?: string
   images: string[]
   price: number
   discount: number
   brand: {
      title: string
   }
   categories: Array<{
      title: string
   }>
   isAvailable: boolean
}

interface CartCrossSellProps {
   limit?: number
   title?: string
   description?: string
}

export function CartCrossSell({ 
   limit = 6, 
   title = "Frequently bought together",
   description = "Products often purchased with items in your cart"
}: CartCrossSellProps) {
   const { cart } = useCartContext()
   const [suggestions, setSuggestions] = useState<Product[]>([])
   const [loading, setLoading] = useState(true)
   const [error, setError] = useState<string | null>(null)

   useEffect(() => {
      const fetchCartCrossSells = async () => {
         if (!cart?.items || cart.items.length === 0) {
            setLoading(false)
            return
         }

         try {
            setLoading(true)
            
            // Get all cross-sell products from items in cart
            const crossSellPromises = cart.items.map(item => 
               fetch(`/api/products/${item.productId}/cross-sell?limit=${limit}`)
                  .then(res => res.ok ? res.json() : [])
                  .catch(() => [])
            )

            const allCrossSells = await Promise.all(crossSellPromises)
            
            // Flatten and deduplicate cross-sell products
            const flatCrossSells = allCrossSells.flat()
            const uniqueCrossSells = flatCrossSells.filter((product, index, self) => 
               index === self.findIndex(p => p.id === product.id) &&
               !cart.items.some(cartItem => cartItem.productId === product.id)
            )

            // Limit the results
            setSuggestions(uniqueCrossSells.slice(0, limit))
         } catch (err) {
            console.error('Error fetching cart cross-sells:', err)
            setError(err instanceof Error ? err.message : 'An error occurred')
         } finally {
            setLoading(false)
         }
      }

      fetchCartCrossSells()
   }, [cart?.items, limit])

   if (loading) {
      return (
         <div className="space-y-4">
            <div>
               <h3 className="text-lg font-semibold">{title}</h3>
               <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
               {Array.from({ length: limit }).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                     <CardContent className="p-4">
                        <div className="aspect-square bg-gray-200 rounded-md mb-3" />
                        <div className="h-4 bg-gray-200 rounded mb-2" />
                        <div className="h-3 bg-gray-200 rounded w-2/3 mb-2" />
                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                     </CardContent>
                  </Card>
               ))}
            </div>
         </div>
      )
   }

   if (error) {
      return (
         <div className="space-y-4">
            <div>
               <h3 className="text-lg font-semibold">{title}</h3>
               <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <div className="text-center py-8">
               <p className="text-muted-foreground">Unable to load suggestions</p>
            </div>
         </div>
      )
   }

   if (suggestions.length === 0) {
      return null
   }

   return (
      <div className="space-y-4">
         <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
         </div>
         
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {suggestions.map((product) => (
               <Card key={product.id} className="group hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                     <Link href={`/products/${product.id}`}>
                        <div className="aspect-square relative overflow-hidden rounded-t-lg">
                           {product.images[0] ? (
                              <Image
                                 src={product.images[0]}
                                 alt={product.title}
                                 fill
                                 className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                           ) : (
                              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                 <span className="text-gray-400">No Image</span>
                              </div>
                           )}
                           
                           {product.discount > 0 && (
                              <Badge className="absolute top-2 left-2 bg-red-500">
                                 -{product.discount}%
                              </Badge>
                           )}
                           
                           {!product.isAvailable && (
                              <Badge variant="secondary" className="absolute top-2 right-2">
                                 Out of Stock
                              </Badge>
                           )}
                        </div>
                     </Link>
                     
                     <div className="p-3">
                        <div className="space-y-2">
                           <div className="flex items-center gap-1">
                              <Badge variant="outline" className="text-xs">
                                 {product.brand.title}
                              </Badge>
                              {product.categories[0] && (
                                 <Badge variant="secondary" className="text-xs">
                                    {product.categories[0].title}
                                 </Badge>
                              )}
                           </div>
                           
                           <Link href={`/products/${product.id}`}>
                              <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                                 {product.title}
                              </h4>
                           </Link>
                           
                           <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm">
                                 ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                              </span>
                              {product.discount > 0 && (
                                 <span className="text-xs text-muted-foreground line-through">
                                    ${product.price.toFixed(2)}
                                 </span>
                              )}
                           </div>
                        </div>
                        
                        <div className="flex gap-1 mt-2">
                           <Button 
                              size="sm" 
                              className="flex-1 text-xs"
                              disabled={!product.isAvailable}
                           >
                              <ShoppingCart className="h-3 w-3 mr-1" />
                              Add
                           </Button>
                           <Button size="sm" variant="outline" className="px-2">
                              <Heart className="h-3 w-3" />
                           </Button>
                           <Button size="sm" variant="outline" className="px-2">
                              <Eye className="h-3 w-3" />
                           </Button>
                        </div>
                     </div>
                  </CardContent>
               </Card>
            ))}
         </div>
      </div>
   )
}
