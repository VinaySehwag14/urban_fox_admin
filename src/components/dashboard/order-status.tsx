import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Truck, CheckCircle, XCircle } from "lucide-react"

const statuses = [
    { icon: Package, label: "Pending", count: 124, color: "bg-blue-50 text-blue-600" },
    { icon: Truck, label: "Shipped", count: 88, color: "bg-yellow-50 text-yellow-600" },
    { icon: CheckCircle, label: "Delivered", count: 256, color: "bg-green-50 text-green-600" },
    { icon: XCircle, label: "Returned", count: 15, color: "bg-red-50 text-red-600" },
]

export function OrderStatus() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {statuses.map((status) => (
                        <div key={status.label} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${status.color}`}>
                                    <status.icon className="w-5 h-5" />
                                </div>
                                <span className="font-medium text-gray-700">{status.label}</span>
                            </div>
                            <span className="font-bold text-gray-900">{status.count}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
