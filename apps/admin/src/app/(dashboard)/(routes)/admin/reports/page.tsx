import { eachDayOfInterval, format, min, max } from "date-fns"
import prisma from "@/lib/prisma"
import { formatter } from "@/lib/utils"
import { slugify } from '@persepolis/slugify'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"

import { BrandCombobox, CategoriesCombobox, DateRangePicker } from "./components/options"
import { OrdersOverviewChart } from "./components/overview-chart"
import { ProductsTable, ProductColumn } from "./components/table"

export default async function AdminReportsPage({ searchParams }) {
    const { startDate, endDate, brand, category } = searchParams ?? {}

    function filteredData (filter) {
        return filter
            ? filter.split('+').map((cat) => cat.trim())
            : undefined;
    }

    const categoriesArray = filteredData(category);
    const brandsArray = filteredData(brand);

    const brands = await prisma.brand.findMany()

    const brandIdsArray = [];
    for (const brand of brands) {
        if (brandsArray?.includes(slugify(brand.title))) {
            brandIdsArray.push(brand.id);
        }
    }

    const categories = await prisma.category.findMany()

    const whereClause: any = {}

    if (startDate && endDate) {
        whereClause.createdAt = {
            gte: new Date(startDate),
            lte: new Date(endDate),
        }
    }

    // Group orders by createdAt (day) including brand and category
    const orders = await prisma.order.groupBy({
        by: ["createdAt"],
        _count: { id: true },
        _sum: { total: true },
        where: {
            ...(startDate &&
            endDate && {
                createdAt: {
                    gte: new Date(startDate),
                    lte: new Date(endDate),
                },
            }),
            // Include filters for brand and category (through orderItems -> product)
            ...(brand || (categoriesArray && categoriesArray.length > 0)
            ? {
                orderItems: {
                    some: {
                    product: {
                        ...(brandIdsArray?.length > 0 && {
                            brandId: { in: brandIdsArray },
                        }),
                        ...(categoriesArray && categoriesArray.length > 0 && {
                            categories: {
                                some: {
                                    title: { in: categoriesArray, mode: "insensitive" },
                                },
                            },
                        }),
                    },
                    },
                },
                }
            : {}),
        },
    })

    // Summarize orders by date
    const groupedOrders: Record<string, { count: number; total: number }> = {}

    orders.forEach((o) => {
        const date = format(o.createdAt, "yyyy-MM-dd")
            groupedOrders[date] = {
            count: (groupedOrders[date]?.count ?? 0) + o._count.id,
            total: (groupedOrders[date]?.total ?? 0) + (o._sum.total ?? 0),
        }
    })

    // Determine chart date range
    let allDates: Date[] = []

    if (startDate && endDate) {
        allDates = eachDayOfInterval({
        start: new Date(startDate),
        end: new Date(endDate),
        })
    } else if (orders.length > 0) {
        const minDate = min(orders.map((o) => o.createdAt))
        const maxDate = max(orders.map((o) => o.createdAt))
        allDates = eachDayOfInterval({ start: minDate, end: maxDate })
    } else {
        allDates = [new Date()]
    }

    const chartData = allDates.map((d) => {
        const date = format(d, "yyyy-MM-dd")

        return {
            date,
            orderCount: groupedOrders[date]?.count ?? 0,
            orderTotal: groupedOrders[date]?.total ?? 0,
        }
    })

    // Total Orders and Total Sales (date range aware)
    const totalSummary = await prisma.order.aggregate({
    _count: { id: true },
    _sum: { total: true },
    where: {
        ...(startDate &&
        endDate && {
            createdAt: {
                gte: new Date(startDate),
                lte: new Date(endDate),
            },
        }),
        // Filter orders by products’ brand and categories through order items
        ...(brand || (categoriesArray && categoriesArray.length > 0)
        ? {
            orderItems: {
                some: {
                product: {
                    ...(brandIdsArray?.length > 0 && {
                        brandId: { in: brandIdsArray },
                    }),
                    ...(categoriesArray && categoriesArray.length > 0 && {
                    categories: {
                        some: {
                        title: { in: categoriesArray, mode: "insensitive" },
                        },
                    },
                    }),
                },
                },
            },
            }
        : {}),
    },
})

    const totalOrders = totalSummary._count.id || 0
    const totalSales = totalSummary._sum.total || 0

    // Query to get the products order by most top sales
    const products = await prisma.product.findMany({
        select: {
            id: true,
            title: true,
            price: true,
            discount: true,
            isAvailable: true,
            categories: { select: { title: true } },
            orders: {
            select: {
                order: {
                select: { createdAt: true },
                },
            },
            where: {
                order: {
                ...(startDate &&
                    endDate && {
                    createdAt: {
                        gte: new Date(startDate),
                        lte: new Date(endDate),
                    },
                    }),
                },
            },
            },
        },
        where: {
            ...(brandIdsArray?.length > 0 && {
                brandId: { in: brandIdsArray },
            }),
            ...(categoriesArray && categoriesArray.length > 0 && {
            categories: {
                some: {
                    title: { in: categoriesArray, mode: "insensitive" },
                },
            },
            }),
        },
        orderBy: {
            orders: {
            _count: "desc",
            },
        },
    });

    const topSellingProducts: ProductColumn[] = products.map((p) => ({
        id: p.id,
        title: p.title,
        price: formatter.format(p.price),
        discount: formatter.format(p.discount),
        category: p.categories[0]?.title ?? "Uncategorized",
        sales: p.orders.length,
        isAvailable: p.isAvailable,
    }))

    return (
        <div className="my-6 space-y-6">
        <Heading title="Reports Overview" description="Order and Sales Dashboard" />
        <Separator />
            {/* SUMMARY CARDS */}
            <div className="grid grid-cols-2 gap-4">
                <Card>
                <CardHeader>
                    <CardTitle>Total Orders</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold">{totalOrders}</p>
                    <p className="text-sm text-muted-foreground">
                    {startDate && endDate
                        ? `From ${format(new Date(startDate), "MMM dd, yyyy")} to ${format(
                            new Date(endDate),
                            "MMM dd, yyyy"
                        )}`
                        : "All time"}
                    </p>
                </CardContent>
                </Card>

                <Card>
                <CardHeader>
                    <CardTitle>Total Sales</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold">{formatter.format(totalSales)}</p>
                    <p className="text-sm text-muted-foreground">
                    {startDate && endDate
                        ? `From ${format(new Date(startDate), "MMM dd, yyyy")} to ${format(
                            new Date(endDate),
                            "MMM dd, yyyy"
                        )}`
                        : "All time"}
                    </p>
                </CardContent>
                </Card>
            </div>

            {/* FILTER OPTIONS */}
            <div className="grid gap-4 grid-cols-3">
                <DateRangePicker initialStartDate={startDate} initialEndDate={endDate} />
                <CategoriesCombobox initialCategory={category} categories={categories} />
                <BrandCombobox initialBrand={brand} brands={brands} />
            </div>

            {/* CHART SECTION */}
            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>Orders Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <OrdersOverviewChart data={chartData} />
                </CardContent>
            </Card>

            {/* TABLE SECTION */}
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
