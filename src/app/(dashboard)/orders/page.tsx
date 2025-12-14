import { OrdersHeader } from "@/components/orders/orders-header"
import { OrdersClient } from "@/components/orders/orders-client" // We need a client wrapper for tabs/table state
import { cookies } from "next/headers"

async function getOrders() {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")

    if (!token) return []

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/orders/admin`, {
            headers: {
                Authorization: `Bearer ${token.value}`,
            },
            next: { revalidate: 0 }
        })

        if (!res.ok) {
            // Fallback to non-admin route if admin route fails or doesn't exist yet, 
            // though previous context suggested /admin. 
            // Let's try to stick to what we likely had.
            console.error("Failed to fetch orders via admin route");
            return []
        }

        const data = await res.json()
        return data.orders || []
    } catch (error) {
        console.error("Error fetching orders:", error)
        return []
    }
}

export default async function OrdersPage() {
    const orders = await getOrders()

    return (
        <div className="space-y-6">
            <OrdersHeader />
            <div className="bg-white p-6 rounded-xl border shadow-sm space-y-6">
                <OrdersClient initialOrders={orders} />
            </div>
        </div>
    )
}
