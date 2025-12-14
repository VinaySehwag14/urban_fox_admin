"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useMemo } from "react"
import { Order } from "@/types"

interface RevenueChartProps {
    orders: Order[];
}

export function RevenueChart({ orders }: RevenueChartProps) {
    const [activeTab, setActiveTab] = useState("daily")

    const chartData = useMemo(() => {
        if (!orders || orders.length === 0) return [];

        // Group by date
        const groupedMap = new Map<string, number>();

        orders.forEach(order => {
            if (!order.created_at) return;
            // Format date as "Dec 10" or "2023-12-10"
            const dateObj = new Date(order.created_at);
            const dateKey = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

            // Only count successful payments or valid orders? 
            // Usually we show generated revenue regardless, or only paid. 
            // Let's filter for paid or success payment status
            if (activeTab === 'daily') { // Logic can be expanded for weekly/monthly
                // Filter can be here or pre-calc.
            }

            // Simplest approach: Aggregate all provided orders (page.tsx logic might filter)
            const amount = Number(order.final_amount || order.total_amount || 0);

            groupedMap.set(dateKey, (groupedMap.get(dateKey) || 0) + amount);
        });

        // Convert to array and sort by date if needed (Map doesn't guarantee order if keys inserted randomly, 
        // but typically we'd want chronological. For now, let's just return entries.)
        // Ideally we fill in missing dates, but let's start with sparse data.

        return Array.from(groupedMap.entries()).map(([name, total]) => ({
            name,
            total
        })).reverse(); // API often returns newest first, so iterating might give reverse order? 
        // Actually map insertion order depends on loop. Orders usually new->old.
        // So we likely need to reverse to show Old -> New on chart L->R.

    }, [orders, activeTab]);

    // Sort chronologically if needed, or simple reverse if input is desc
    // Let's assume input orders are desc (newest first).
    const processedData = [...chartData].reverse();

    return (
        <Card className="col-span-4">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Revenue Overview</CardTitle>
                    {/* Tabs partially implemented or visual only for now */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setActiveTab("daily")}
                            className={`px-3 py-1 text-sm rounded-md transition-colors ${activeTab === "daily"
                                ? "bg-[#F59827] text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            Daily
                        </button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pl-2">
                <div className="h-[250px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={processedData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                            <XAxis
                                dataKey="name"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `₹${value}`}
                            />
                            <Tooltip
                                contentStyle={{ background: "#fff", border: "1px solid #eee", borderRadius: "8px" }}
                                cursor={{ stroke: "#eee" }}
                                formatter={(value: number) => [`₹${value}`, "Revenue"]}
                            />
                            <Line
                                type="monotone"
                                dataKey="total"
                                stroke="#F59827"
                                strokeWidth={2}
                                dot={{ fill: "#F59827", r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
