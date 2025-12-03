export const ProductsQueryKey = {
   all: (query: {
      categoryId?: string
      brandId?: string
      sortBy?: string
      priceRange?: string
      searchTerm?: string
   }) => [
      'products',
      {
         ...query,
      },
   ],
}
