"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

const data = [
    { name: "Week 1", total: 2400 },
    { name: "Week 2", total: 1398 },
    { name: "Week 3", total: 9800 },
    { name: "Week 4", total: 3908 },
]

export function RevenueChart() {
    const [activeTab, setActiveTab] = useState("weekly")

    return (
        <Card className="col-span-4">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Revenue Overview</CardTitle>
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
                        <button
                            onClick={() => setActiveTab("weekly")}
                            className={`px-3 py-1 text-sm rounded-md transition-colors ${activeTab === "weekly"
                                    ? "bg-[#F59827] text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            Weekly
                        </button>
                        <button
                            onClick={() => setActiveTab("monthly")}
                            className={`px-3 py-1 text-sm rounded-md transition-colors ${activeTab === "monthly"
                                    ? "bg-[#F59827] text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            Monthly
                        </button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pl-2">
                <div className="h-[250px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <XAxis
                                dataKey="name"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip
                                contentStyle={{ background: "#fff", border: "1px solid #eee", borderRadius: "8px" }}
                                cursor={{ stroke: "#eee" }}
                            />
                            <Line
                                type="monotone"
                                dataKey="total"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
