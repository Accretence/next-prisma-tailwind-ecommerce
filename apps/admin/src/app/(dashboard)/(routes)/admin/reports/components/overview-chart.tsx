'use client'

import {
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    Legend,
    LineChart,
    Line,
} from "recharts"
import { format } from "date-fns"

interface OrdersOverviewChartProps {
    data: {
        date: string
        orderCount: number
        orderTotal: number
    }[]
}

export const OrdersOverviewChart: React.FC<OrdersOverviewChartProps> = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis
                    dataKey="date"
                    tickFormatter={(date) => format(new Date(date), "MMM dd")}
                    tickMargin={8}
                />
                <YAxis
                    yAxisId="left"
                    label={{ value: "Orders", angle: -90, position: "insideLeft" }}
                    stroke="#3b82f6"
                />
                <YAxis
                    yAxisId="right"
                    orientation="right"
                    label={{ value: "Sales ($)", angle: -90, position: "insideRight" }}
                    stroke="#10b981"
                />
                <Tooltip
                    content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                        const orders = payload.find((p) => p.dataKey === "orderCount")?.value
                        const sales = payload.find((p) => p.dataKey === "orderTotal")?.value

                        return (
                            <div className="rounded-md border bg-background/95 p-3 shadow-sm">
                            <p className="font-semibold text-sm mb-1">{format(new Date(label), "PPP")}</p>
                            <p className="text-blue-500 text-sm">Orders: {orders}</p>
                            <p className="text-green-600 text-sm">Total Sales: ${sales?.toLocaleString()}</p>
                            </div>
                        )
                        }
                        return null
                    }}
                />
                <Legend />

                {/* Smooth, seismograph-like lines */}
                <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="orderCount"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 6 }}
                    name="Orders"
                    animationDuration={1000}
                    animationEasing="ease-in-out"
                />
                <Line
                yAxisId="right"
                    type="monotone"
                    dataKey="orderTotal"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 6 }}
                    name="Total Sales"
                    animationDuration={1000}
                    animationEasing="ease-in-out"
                />
            </LineChart>
        </ResponsiveContainer>
    )
}
