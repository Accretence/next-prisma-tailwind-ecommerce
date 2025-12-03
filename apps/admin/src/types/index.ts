export type ProductInfo = {
   id: string
   title: string
   totalQuantity: number
   orderCount: number
   image?: string
}

export type OrderItem = {
   count: number
   discount: number
   orderId: string
   price: number
   productId: string
   product: {
      id: string
      title: string
      description?: string
      images?: string[]
      keywords?: string[]
   }
}

export type Order = {
   id: string
   number: number
   status: string
   total: number
   shipping: number
   createdAt: string
   orderItems: OrderItem[]
   payable: number
}
