export function writeLocalCart(items) {
   window.localStorage.setItem('Cart', JSON.stringify(items))
}

export function getLocalCart() {
   if (typeof window !== 'undefined' && window.localStorage) {
      try {
         const cart = JSON.parse(window.localStorage.getItem('Cart'))
         // Ensure cart has items array
         if (!cart || !cart.items || !Array.isArray(cart.items)) {
            writeLocalCart({ items: [] })
            return { items: [] }
         }
         return cart
      } catch (error) {
         writeLocalCart({ items: [] })
         return { items: [] }
      }
   }
   // Return default structure when window is undefined (SSR)
   return { items: [] }
}

export function getCountInCart({ cartItems, productId }) {
   try {
      // Check if cartItems exists and is an array
      if (!cartItems || !Array.isArray(cartItems)) {
         return 0
      }

      for (let i = 0; i < cartItems.length; i++) {
         if (cartItems[i]?.productId === productId) {
            return cartItems[i]?.count || 0
         }
      }

      return 0
   } catch (error) {
      console.error({ error })
      return 0
   }
}
