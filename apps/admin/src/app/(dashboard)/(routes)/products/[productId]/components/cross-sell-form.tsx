'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Plus, X, Search } from 'lucide-react'
import { toast } from 'sonner'

interface Product {
   id: string
   title: string
   brand: {
      title: string
   }
   categories: Array<{
      title: string
   }>
   price: number
   isAvailable: boolean
}

interface CrossSellFormProps {
   productId: string
   productTitle: string
}

export function CrossSellForm({ productId, productTitle }: CrossSellFormProps) {
   const [currentCrossSells, setCurrentCrossSells] = useState<Product[]>([])
   const [availableProducts, setAvailableProducts] = useState<Product[]>([])
   const [selectedProducts, setSelectedProducts] = useState<string[]>([])
   const [searchTerm, setSearchTerm] = useState('')
   const [brandFilter, setBrandFilter] = useState('')
   const [loading, setLoading] = useState(true)
   const [saving, setSaving] = useState(false)
   const [error, setError] = useState<string | null>(null)

   // Fetch current cross-sell products
   useEffect(() => {
      const fetchCurrentCrossSells = async () => {
         try {
            const response = await fetch(`/api/products/${productId}/cross-sell`)
            if (response.ok) {
               const data = await response.json()
               setCurrentCrossSells(data)
            }
         } catch (err) {
            console.error('Error fetching current cross-sells:', err)
         }
      }

      fetchCurrentCrossSells()
   }, [productId])

   // Fetch available products for selection
   useEffect(() => {
      const fetchAvailableProducts = async () => {
         try {
            setLoading(true)
            const params = new URLSearchParams()
            if (searchTerm) params.set('search', searchTerm)
            if (brandFilter) params.set('brand', brandFilter)
            
            const response = await fetch(`/api/products?${params.toString()}`)
            if (response.ok) {
               const data = await response.json()
               // Filter out the current product and already selected cross-sells
               const filtered = data.filter((product: Product) => 
                  product.id !== productId && 
                  !currentCrossSells.some(cs => cs.id === product.id)
               )
               setAvailableProducts(filtered)
            }
         } catch (err) {
            console.error('Error fetching available products:', err)
            setError('Failed to load available products')
         } finally {
            setLoading(false)
         }
      }

      fetchAvailableProducts()
   }, [searchTerm, brandFilter, productId, currentCrossSells])

   const handleAddCrossSells = async () => {
      if (selectedProducts.length === 0) {
         toast.error('Please select at least one product')
         return
      }

      try {
         setSaving(true)
         const response = await fetch(`/api/products/${productId}/cross-sell`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               crossSellProductIds: selectedProducts
            })
         })

         if (response.ok) {
            const updatedProduct = await response.json()
            setCurrentCrossSells(updatedProduct.Product_A)
            setSelectedProducts([])
            toast.success('Cross-sell products added successfully')
         } else {
            throw new Error('Failed to add cross-sell products')
         }
      } catch (err) {
         console.error('Error adding cross-sell products:', err)
         toast.error('Failed to add cross-sell products')
      } finally {
         setSaving(false)
      }
   }

   const handleRemoveCrossSell = async (crossSellId: string) => {
      try {
         setSaving(true)
         const response = await fetch(`/api/products/${productId}/cross-sell?productIds=${crossSellId}`, {
            method: 'DELETE'
         })

         if (response.ok) {
            const updatedProduct = await response.json()
            setCurrentCrossSells(updatedProduct.Product_A)
            toast.success('Cross-sell product removed successfully')
         } else {
            throw new Error('Failed to remove cross-sell product')
         }
      } catch (err) {
         console.error('Error removing cross-sell product:', err)
         toast.error('Failed to remove cross-sell product')
      } finally {
         setSaving(false)
      }
   }

   const handleProductSelect = (productId: string, checked: boolean) => {
      if (checked) {
         setSelectedProducts(prev => [...prev, productId])
      } else {
         setSelectedProducts(prev => prev.filter(id => id !== productId))
      }
   }

   return (
      <div className="space-y-6">
         <Card>
            <CardHeader>
               <CardTitle>Cross-Sell Products for "{productTitle}"</CardTitle>
               <CardDescription>
                  Manage products that are recommended alongside this product
               </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               {/* Current Cross-Sell Products */}
               <div>
                  <h4 className="font-medium mb-3">Current Cross-Sell Products ({currentCrossSells.length})</h4>
                  {currentCrossSells.length === 0 ? (
                     <p className="text-muted-foreground text-sm">No cross-sell products configured</p>
                  ) : (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {currentCrossSells.map((product) => (
                           <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex-1">
                                 <p className="font-medium text-sm">{product.title}</p>
                                 <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline" className="text-xs">
                                       {product.brand.title}
                                    </Badge>
                                    {product.categories[0] && (
                                       <Badge variant="secondary" className="text-xs">
                                          {product.categories[0].title}
                                       </Badge>
                                    )}
                                    <span className="text-xs text-muted-foreground">
                                       ${product.price}
                                    </span>
                                 </div>
                              </div>
                              <Button
                                 size="sm"
                                 variant="ghost"
                                 onClick={() => handleRemoveCrossSell(product.id)}
                                 disabled={saving}
                              >
                                 <X className="h-4 w-4" />
                              </Button>
                           </div>
                        ))}
                     </div>
                  )}
               </div>

               {/* Add New Cross-Sell Products */}
               <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Add Cross-Sell Products</h4>
                  
                  {/* Search and Filter */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                     <div>
                        <Label htmlFor="search">Search Products</Label>
                        <div className="relative">
                           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                           <Input
                              id="search"
                              placeholder="Search by title..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="pl-10"
                           />
                        </div>
                     </div>
                     <div>
                        <Label htmlFor="brand">Filter by Brand</Label>
                        <Select value={brandFilter} onValueChange={setBrandFilter}>
                           <SelectTrigger>
                              <SelectValue placeholder="All brands" />
                           </SelectTrigger>
                           <SelectContent>
                              <SelectItem value="">All brands</SelectItem>
                              {/* Add brand options here */}
                           </SelectContent>
                        </Select>
                     </div>
                  </div>

                  {/* Available Products */}
                  {loading ? (
                     <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin" />
                     </div>
                  ) : error ? (
                     <Alert>
                        <AlertDescription>{error}</AlertDescription>
                     </Alert>
                  ) : (
                     <div className="space-y-2 max-h-60 overflow-y-auto">
                        {availableProducts.map((product) => (
                           <div key={product.id} className="flex items-center space-x-3 p-2 border rounded-lg">
                              <Checkbox
                                 id={product.id}
                                 checked={selectedProducts.includes(product.id)}
                                 onCheckedChange={(checked) => handleProductSelect(product.id, checked as boolean)}
                              />
                              <div className="flex-1">
                                 <Label htmlFor={product.id} className="font-medium text-sm cursor-pointer">
                                    {product.title}
                                 </Label>
                                 <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline" className="text-xs">
                                       {product.brand.title}
                                    </Badge>
                                    {product.categories[0] && (
                                       <Badge variant="secondary" className="text-xs">
                                          {product.categories[0].title}
                                       </Badge>
                                    )}
                                    <span className="text-xs text-muted-foreground">
                                       ${product.price}
                                    </span>
                                    {!product.isAvailable && (
                                       <Badge variant="destructive" className="text-xs">
                                          Out of Stock
                                       </Badge>
                                    )}
                                 </div>
                              </div>
                           </div>
                        ))}
                        {availableProducts.length === 0 && (
                           <p className="text-muted-foreground text-sm text-center py-4">
                              No products found matching your criteria
                           </p>
                        )}
                     </div>
                  )}

                  {/* Add Button */}
                  <div className="flex justify-end pt-4">
                     <Button
                        onClick={handleAddCrossSells}
                        disabled={selectedProducts.length === 0 || saving}
                     >
                        {saving ? (
                           <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                           <Plus className="h-4 w-4 mr-2" />
                        )}
                        Add {selectedProducts.length > 0 ? `${selectedProducts.length} ` : ''}Product{selectedProducts.length !== 1 ? 's' : ''}
                     </Button>
                  </div>
               </div>
            </CardContent>
         </Card>
      </div>
   )
}
