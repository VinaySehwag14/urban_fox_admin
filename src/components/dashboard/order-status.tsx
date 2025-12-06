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
                                    style={{ width: `${(status.count / 483) * 100}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
