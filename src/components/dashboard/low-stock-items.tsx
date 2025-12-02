import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Shirt, AlertCircle } from "lucide-react"

const products = [
    { name: "SnowFlake' Festive Sweater", stock: 5, status: "Stock Remaining" },
    { name: "Vintage Denim Jacket", stock: 8, status: "Stock Remaining" },
    { name: "Basic Beige T-Shirt", stock: 2, status: "Stock Remaining" },
]

export function LowStockItems() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Low Stock Items</CardTitle>
                <a href="#" className="text-sm text-[#F59827] hover:underline">View All</a>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {products.map((product, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 rounded-lg">
                                    <AvatarFallback className="rounded-lg bg-gray-100">
                                        <Shirt className="w-5 h-5 text-gray-600" />
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                                    <p className="text-xs text-gray-500">{product.status}</p>
                                </div>
                            </div>
                            <div className={`px-2 py-1 rounded-full text-xs font-semibold ${product.stock <= 2 ? 'bg-red-100 text-red-600' :
                                    product.stock <= 5 ? 'bg-yellow-100 text-yellow-600' :
                                        'bg-orange-100 text-orange-600'
                                }`}>
                                {product.stock}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
