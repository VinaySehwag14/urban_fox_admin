"use client"

import { useState } from "react"
import { OrdersTabs } from "@/components/orders/orders-tabs"
import { OrdersTable } from "@/components/orders/orders-table"
import { Order } from "@/types" // Ensure this type exists or use any for now if type file is reverted

interface OrdersClientProps {
    initialOrders: any[]
}

export function OrdersClient({ initialOrders }: OrdersClientProps) {
    const [currentTab, setCurrentTab] = useState("All")

    // Filter logic
    const filteredOrders = initialOrders.filter((order) => {
        if (currentTab === "All") return true
        // Map tab names to status. Adjustable based on real status values.
        // "Processing", "Shipped", "Delivered", "Cancelled" match well.
        return order.order_status === currentTab || order.payment_status === currentTab
    })

    return (
        <div className="space-y-6">
            <OrdersTabs currentTab={currentTab} onTabChange={setCurrentTab} />
            <OrdersTable orders={filteredOrders} />
        </div>
    )
}
