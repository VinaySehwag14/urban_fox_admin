"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { AlertTriangle, Package } from "lucide-react"
import { Product } from "@/types"
import { useMemo } from "react"

interface LowStockItemsProps {
    products: Product[];
}

export function LowStockItems({ products }: LowStockItemsProps) {

    const lowStockList = useMemo(() => {
        // Collect products or variants with low stock (< 10)
        const items: { name: string; stock: number }[] = [];

        products.forEach(p => {
            if (p.variants && p.variants.length > 0) {
                p.variants.forEach(v => {
                    if (v.stock_quantity < 10) {
                        items.push({
                            name: `${p.name} (${v.size || ''} ${v.color || ''})`,
                            stock: v.stock_quantity
                        });
                    }
                });
            } else if ((p.stock || 0) < 10) {
                items.push({ name: p.name, stock: p.stock || 0 });
            }
        });

        // Return top 5 lowest
        return items.sort((a, b) => a.stock - b.stock).slice(0, 5);
    }, [products]);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Low Stock Alert</CardTitle>
                {/* <a href="/inventory" className="text-sm text-[#F59827] hover:underline">View All</a> */}
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {lowStockList.length === 0 ? (
                        <div className="text-center py-4 text-gray-500 text-sm flex flex-col items-center gap-2">
                            <Package className="w-8 h-8 opacity-20" />
                            <span>Inventory is healthy!</span>
                        </div>
                    ) : (
                        lowStockList.map((item, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10 rounded-lg">
                                        <AvatarFallback className="rounded-lg bg-red-50">
                                            <AlertTriangle className="w-5 h-5 text-red-500" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 line-clamp-1 max-w-[180px]" title={item.name}>{item.name}</p>
                                        <p className="text-xs text-gray-500">Stock Remaining</p>
                                    </div>
                                </div>
                                <div className={`px-2 py-1 rounded-full text-xs font-semibold ${item.stock === 0 ? 'bg-red-100 text-red-600' :
                                    item.stock <= 5 ? 'bg-orange-100 text-orange-600' :
                                        'bg-yellow-100 text-yellow-600'
                                    }`}>
                                    {item.stock}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
