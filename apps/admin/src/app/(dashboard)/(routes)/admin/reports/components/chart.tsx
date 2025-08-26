'use client'

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

interface OrderReportProps {
   data: any[]
}

export const OrderReportChart: React.FC<OrderReportProps> = ({ data }) => {
   return (
    <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="orderCount" stroke="#3498db" />
        </LineChart>
    </ResponsiveContainer>
   )
}
