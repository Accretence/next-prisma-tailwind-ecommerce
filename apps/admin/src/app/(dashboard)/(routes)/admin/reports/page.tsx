import { format } from "date-fns"

import prisma from '@/lib/prisma'
import { formatter } from '@/lib/utils'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'

import { BrandCombobox, CategoriesCombobox, DateRangePicker } from "./components/options"
import { OrderReportChart } from './components/chart'
import { ProductColumn, ProductsTable } from './components/table'

export default async function ReportsPage({ searchParams }) {
   const { startDate, endDate, brand, category, page = 1 } = searchParams ?? null

   const filteredCategories = category ? 
        category
            .split(',')
            .map((cat) => cat.trim())
        : 
        undefined

    const brands = await prisma.brand.findMany()
    const categories = await prisma.category.findMany()

    // CHART DATA: Order total grouped by date.
    const orders = await prisma.order.groupBy({
        by: ['createdAt'],
        _count: {
            id: true, // count total orders
        },
        where: {
            createdAt: {
                gte: startDate,
                lte: endDate,
            },
        orderItems: {
            some: {
                product: {
                    brand: {
                        title: {
                            contains: brand,
                            mode: 'insensitive'
                        }
                    },
                    categories: {
                        some: {
                            title: {
                                in: filteredCategories,
                                mode: 'insensitive'
                            }
                        }
                    }
                }
            }
        }
        },
    });

    const groupedOrders: Record<string, number> = {};

    // Aggregate orders by date using date-fns for formatting
    orders.forEach(order => {
        const date = format(order.createdAt, 'yyyy-MM-dd'); // format date
        groupedOrders[date] = (groupedOrders[date] || 0) + order._count.id;
    });

    // Format the data for chart.
    const ordersChartData = Object.entries(groupedOrders)
    .map(([date, orderCount]) => ({ date, orderCount }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());


    // TABLE DATA: Top Selling Products.
    const products = await prisma.product.findMany({
        select: {
            id: true,
            title: true,
            price: true,
            discount: true,
            isAvailable: true,
            categories: { select: { title: true } },
            orders: {
                where: {
                    order: {
                        createdAt: { gte: startDate, lte: endDate },
                    },
                },
                select: {
                    orderId: true,
                    count: true,
                    order: {
                        select: {
                            createdAt: true
                        }
                    }
                },
            },
        },
        where: {
            orders: {
                some: {
                    order: {
                        createdAt: {
                            gte: startDate,
                            lte: endDate,
                        }
                    }
                }
            },
            brand: {
                title: {
                    contains: brand,
                    mode: 'insensitive'
                }
            },
            categories: {
                some: {
                    title: {
                        in: filteredCategories,
                        mode: 'insensitive'
                    }
                }
            }
        },
        orderBy: {
            orders: {
                _count: 'desc',
            }
        }
    })

    // Format the data for table.
    const topSellingProducts: ProductColumn[] = products.map((product) => ({
        id: product.id,
        title: product.title,
        price: formatter.format(product.price),
        discount: formatter.format(product.discount),
        category: product.categories[0].title,
        sales: product.orders.length,
        isAvailable: product.isAvailable,
    }))

   return (
      <div className="block my-6 space-y-4">
         <Heading title={'Reports'} description="Product and order insights" />
         <Separator />
         <div className="grid gap-4 grid-cols-3">
            <DateRangePicker
               initialStartDate={startDate}
               initialEndDate={endDate}
            />
            <CategoriesCombobox
               initialCategory={category}
               categories={categories}
            />
            <BrandCombobox initialBrand={brand} brands={brands} />
         </div>
         <Card className="col-span-4">
            <CardHeader>
               <CardTitle>Orders</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
               <OrderReportChart data={ordersChartData} />
            </CardContent>
         </Card>
         <Card className="col-span-4">
            <CardHeader>
               <CardTitle>Top Selling Products</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
               <ProductsTable data={topSellingProducts} />
            </CardContent>
         </Card>
      </div>
   )
}
