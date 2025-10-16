'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export type ProductColumn = {
    id: string
    title: string
    price: string
    discount: string
    category: string
    sales: number
    isAvailable: boolean
}

interface ProductsTableProps {
    data: ProductColumn[]
}

export const ProductsTable: React.FC<ProductsTableProps> = ({ data }) => {
    return (
        <div className="rounded-md border">
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
            {data.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        No data available
                    </TableCell>
                </TableRow>
            ) : (
                data.map((item) => 
                    item.sales > 0 &&
                (
                    <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.title}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.price}</TableCell>
                        <TableCell>{item.discount}</TableCell>
                        <TableCell>{item.sales}</TableCell>
                        <TableCell>
                            {item.isAvailable ? (
                                <span className="text-green-600">Available</span>
                            ) : (
                                <span className="text-red-500">Out of Stock</span>
                            )}
                        </TableCell>
                    </TableRow>
                ))
            )}
            </TableBody>
        </Table>
        </div>
    )
}
