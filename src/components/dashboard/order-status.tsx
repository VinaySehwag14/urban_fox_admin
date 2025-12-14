"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Truck, CheckCircle, XCircle, Clock } from "lucide-react"
import { Order } from "@/types"

interface OrderStatusProps {
    orders: Order[];
}

export function OrderStatus({ orders }: OrderStatusProps) {

    // Calculate counts
    const counts = {
        placed: 0,
        processing: 0, // 'packed' could map here
        shipped: 0,
        delivered: 0,
        cancelled: 0
    };

    orders.forEach(order => {
        const s = order.status?.toLowerCase();
        if (s === 'placed') counts.placed++;
        else if (s === 'packed' || s === 'processing') counts.processing++;
        else if (s === 'shipped') counts.shipped++;
        else if (s === 'delivered') counts.delivered++;
        else if (s === 'cancelled') counts.cancelled++;
    });

    const totalOrders = orders.length || 1; // Avoid divide by zero

    const statuses = [
        { icon: Package, label: "Placed", count: counts.placed, color: "bg-blue-50 text-blue-600", key: 'placed' },
        { icon: Clock, label: "Processing", count: counts.processing, color: "bg-orange-50 text-orange-600", key: 'processing' },
        { icon: Truck, label: "Shipped", count: counts.shipped, color: "bg-yellow-50 text-yellow-600", key: 'shipped' },
        { icon: CheckCircle, label: "Delivered", count: counts.delivered, color: "bg-green-50 text-green-600", key: 'delivered' },
        { icon: XCircle, label: "Cancelled", count: counts.cancelled, color: "bg-red-50 text-red-600", key: 'cancelled' },
    ].filter(s => s.count >= 0); // Keep all for structure or filter 0? Let's keep structure.

    return (
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {statuses.map((status) => (
                        <div key={status.label} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${status.color}`}>
                                        <status.icon className="w-4 h-4" />
                                    </div>
                                    <span className="font-medium text-sm text-gray-700">{status.label}</span>
                                </div>
                                <span className="font-bold text-sm text-gray-900">{status.count}</span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${status.color.split(" ")[0].replace("bg-", "bg-opacity-100 bg-")}`}
                                    style={{ width: `${(status.count / totalOrders) * 100}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
