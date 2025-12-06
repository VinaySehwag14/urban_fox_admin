"use client"

import { useState } from "react"
import { OrdersHeader } from "@/components/orders/orders-header"
import { OrdersTabs } from "@/components/orders/orders-tabs"
import { OrdersTable } from "@/components/orders/orders-table"

export default function OrdersPage() {
    const [currentTab, setCurrentTab] = useState("All")

    return (
        <div className="space-y-6">
            <OrdersHeader />
            <div className="bg-white p-6 rounded-xl border shadow-sm space-y-6">
                <OrdersTabs currentTab={currentTab} onTabChange={setCurrentTab} />
                <OrdersTable />
            </div>
        </div>
    )
}
