import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const products = [
    { name: "Vintage Denim Jacket", sales: "120 sold", price: "$79.99" },
    { name: "Classic White Tee", sales: "98 sold", price: "$24.99" },
    { name: "Urban Cargo Pants", sales: "75 sold", price: "$65.00" },
    { name: "Cozy Knit Sweater", sales: "62 sold", price: "$89.50" },
    { name: "Minimalist Sneakers", sales: "51 sold", price: "$120.00" },
]

export function PopularProducts() {
    return (
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle>Popular Products</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {products.map((product, index) => (
                        <div key={index} className="flex items-center">
                            <Avatar className="h-12 w-12 rounded-lg">
                                <AvatarFallback className="rounded-lg bg-[#FFF4E6] text-[#F59827]">
                                    {product.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="ml-4 space-y-1">
                                <p className="text-sm font-medium leading-none">{product.name}</p>
                                <p className="text-sm text-muted-foreground">{product.sales}</p>
                            </div>
                            <div className="ml-auto font-medium">{product.price}</div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
