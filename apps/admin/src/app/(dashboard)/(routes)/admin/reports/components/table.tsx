'use client'

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { CheckIcon, EditIcon, XIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface ProductsTableProps {
   data: ProductColumn[]
}

export const ProductsTable: React.FC<ProductsTableProps> = ({ data }) => {
   const router = useRouter()

   return <DataTable searchKey="title" columns={columns} data={data} />
}

export type ProductColumn = {
   id: string
   title: string
   price: string
   discount: string
   category: string
   sales: number
   isAvailable: boolean
}

export const columns: ColumnDef<ProductColumn>[] = [
   {
      accessorKey: 'title',
      header: 'Title',
   },
   {
      accessorKey: 'price',
      header: 'Price',
   },
   {
      accessorKey: 'discount',
      header: 'Discount',
   },
   {
      accessorKey: 'category',
      header: 'Category',
   },
   {
      accessorKey: 'sales',
      header: 'Sales #',
   },
   {
      accessorKey: 'isAvailable',
      header: 'Availability',
      cell: (props) => (props.cell.getValue() ? <CheckIcon /> : <XIcon />),
   },
   {
      id: 'actions',
      cell: ({ row }) => (
         <Link href={`/products/${row.original.id}`}>
            <Button size="icon" variant="outline">
               <EditIcon className="h-4" />
            </Button>
         </Link>
      ),
   },
]
