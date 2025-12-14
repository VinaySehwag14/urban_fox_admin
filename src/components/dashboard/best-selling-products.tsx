"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Shirt, Package } from "lucide-react"
import { Order } from "@/types"
import { useMemo } from "react"

interface BestSellingProductsProps {
    orders: Order[];
}

export function BestSellingProducts({ orders }: BestSellingProductsProps) {

    // Calculate best sellers from order items
    const topProducts = useMemo(() => {
        const productSales = new Map<string, number>();
        const productNames = new Map<string, string>(); // Store names to ensure display

        orders.forEach(order => {
            if (!order.items || order.status === 'cancelled') return;

            order.items.forEach(item => {
                const key = item.product_name; // Use ID if available and consistent, name is fallback
                if (!key) return;

                const current = productSales.get(key) || 0;
                productSales.set(key, current + (item.quantity || 1));
                productNames.set(key, item.product_name);
            });
        });

        // Convert to array and sort
        return Array.from(productSales.entries())
            .map(([name, sales]) => ({ name, sales }))
            .sort((a, b) => b.sales - a.sales)
            .slice(0, 5); // Top 5
    }, [orders]);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Best Selling Products</CardTitle>
                {/* <a href="/inventory" className="text-sm text-[#F59827] hover:underline">View All</a> */}
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {topProducts.length === 0 ? (
                        <div className="text-center py-4 text-gray-500 text-sm">No sales data yet.</div>
                    ) : (
                        topProducts.map((product, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10 rounded-lg">
                                        <AvatarFallback className="rounded-lg bg-gray-100">
                                            <Package className="w-5 h-5 text-gray-600" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                                        <p className="text-xs text-gray-500">Popular Item</p>
                                    </div>
                                </div>
                                <span className="font-semibold text-gray-900">{product.sales} sold</span>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
