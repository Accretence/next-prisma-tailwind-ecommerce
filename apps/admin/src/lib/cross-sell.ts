import { prisma } from '@/lib/prisma'

/**
 * Add cross-sell products to a product
 * @param productId - The ID of the product to add cross-sell products to
 * @param crossSellProductIds - Array of product IDs to add as cross-sell products
 */
export async function addCrossSellProducts(productId: string, crossSellProductIds: string[]) {
   try {
      const product = await prisma.product.update({
         where: { id: productId },
         data: {
            Product_A: {
               connect: crossSellProductIds.map(id => ({ id }))
            }
         },
         include: {
            Product_A: {
               include: {
                  brand: true,
                  categories: true
               }
            }
         }
      })
      
      return product
   } catch (error) {
      console.error('Error adding cross-sell products:', error)
      throw error
   }
}

/**
 * Remove cross-sell products from a product
 * @param productId - The ID of the product to remove cross-sell products from
 * @param crossSellProductIds - Array of product IDs to remove as cross-sell products
 */
export async function removeCrossSellProducts(productId: string, crossSellProductIds: string[]) {
   try {
      const product = await prisma.product.update({
         where: { id: productId },
         data: {
            Product_A: {
               disconnect: crossSellProductIds.map(id => ({ id }))
            }
         },
         include: {
            Product_A: {
               include: {
                  brand: true,
                  categories: true
               }
            }
         }
      })
      
      return product
   } catch (error) {
      console.error('Error removing cross-sell products:', error)
      throw error
   }
}

/**
 * Set cross-sell products for a product (replaces existing ones)
 * @param productId - The ID of the product to set cross-sell products for
 * @param crossSellProductIds - Array of product IDs to set as cross-sell products
 */
export async function setCrossSellProducts(productId: string, crossSellProductIds: string[]) {
   try {
      const product = await prisma.product.update({
         where: { id: productId },
         data: {
            Product_A: {
               set: crossSellProductIds.map(id => ({ id }))
            }
         },
         include: {
            Product_A: {
               include: {
                  brand: true,
                  categories: true
               }
            }
         }
      })
      
      return product
   } catch (error) {
      console.error('Error setting cross-sell products:', error)
      throw error
   }
}

/**
 * Get cross-sell products for a product
 * @param productId - The ID of the product to get cross-sell products for
 * @param limit - Optional limit for the number of cross-sell products to return
 */
export async function getCrossSellProducts(productId: string, limit?: number) {
   try {
      const product = await prisma.product.findUnique({
         where: { id: productId },
         include: {
            Product_A: {
               include: {
                  brand: true,
                  categories: true
               },
               ...(limit && { take: limit })
            }
         }
      })
      
      return product?.Product_A || []
   } catch (error) {
      console.error('Error getting cross-sell products:', error)
      throw error
   }
}

/**
 * Get products that cross-sell a specific product
 * @param productId - The ID of the product to find cross-sell references for
 */
export async function getCrossSellReferences(productId: string) {
   try {
      const products = await prisma.product.findMany({
         where: {
            Product_A: {
               some: {
                  id: productId
               }
            }
         },
         include: {
            brand: true,
            categories: true
         }
      })
      
      return products
   } catch (error) {
      console.error('Error getting cross-sell references:', error)
      throw error
   }
}

/**
 * Get bidirectional cross-sell products (products that cross-sell each other)
 * @param productId - The ID of the product to get bidirectional cross-sells for
 */
export async function getBidirectionalCrossSells(productId: string) {
   try {
      const [Product_A, crossSellReferences] = await Promise.all([
         getCrossSellProducts(productId),
         getCrossSellReferences(productId)
      ])
      
      // Combine and deduplicate
      const allCrossSells = [...Product_A, ...crossSellReferences]
      const uniqueCrossSells = allCrossSells.filter((product, index, self) => 
         index === self.findIndex(p => p.id === product.id)
      )
      
      return uniqueCrossSells
   } catch (error) {
      console.error('Error getting bidirectional cross-sells:', error)
      throw error
   }
}
