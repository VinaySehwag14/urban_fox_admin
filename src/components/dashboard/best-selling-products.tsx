import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Shirt } from "lucide-react"

const products = [
    { name: "Classic Black T-Shirt", sales: 1204, icon: "👕" },
    { name: "Cozy Gray Hoodie", sales: 982, icon: "🧥" },
    { name: "Oversized White Sweatshirt", sales: 751, icon: "👔" },
]

export function BestSellingProducts() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Best Selling Products</CardTitle>
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
                                    <p className="text-xs text-gray-500">Product</p>
                                </div>
                            </div>
                            <span className="font-semibold text-gray-900">{product.sales}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
