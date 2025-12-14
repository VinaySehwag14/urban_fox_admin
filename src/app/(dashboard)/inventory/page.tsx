import { InventoryTable } from "@/components/inventory/inventory-table";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Package, AlertTriangle, AlertOctagon } from "lucide-react";
import { cookies } from "next/headers";
import { Product } from "@/types";

interface ProductsResponse {
    products: Product[];
    total: number;
    page: number;
    limit: number;
    pages: number;
}

async function getProducts(): Promise<Product[]> {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token");

    if (!token) {
        return [];
    }

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/products/all`, {
            headers: {
                Authorization: `Bearer ${token.value}`,
            },
            next: { revalidate: 0 } // No cache for inventory
        });

        if (!res.ok) {
            console.error("Failed to fetch products for inventory", await res.text());
            return [];
        }

        const data: ProductsResponse = await res.json();
        return data.products || [];
    } catch (error) {
        console.error("Error fetching inventory:", error);
        return [];
    }
}

export default async function InventoryPage() {
    const products = await getProducts();

    const lowStockCount = products.reduce((acc, p) => {
        const variants = p.variants || [];
        if (variants.length > 0) {
            return acc + variants.filter(v => v.stock_quantity < 10 && v.stock_quantity > 0).length;
        }
        return acc + ((p.stock || 0) < 10 && (p.stock || 0) > 0 ? 1 : 0);
    }, 0);

    const outOfStockCount = products.reduce((acc, p) => {
        const variants = p.variants || [];
        if (variants.length > 0) {
            return acc + variants.filter(v => v.stock_quantity === 0).length;
        }
        return acc + ((p.stock || 0) === 0 ? 1 : 0);
    }, 0);

    // Calculate Total Inventory Items (SKUs)
    const totalInventoryItems = products.reduce((acc, p) => {
        // Use variant count if available, otherwise 1 (the product itself)
        return acc + (p.variants && p.variants.length > 0 ? p.variants.length : 1);
    }, 0);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight">Inventory Management</h1>

            <div className="grid gap-4 md:grid-cols-3">
                <StatsCard
                    title="Total SKUs"
                    value={(totalInventoryItems || 0).toString()}
                    icon={Package}
                    trend="active"
                />
                <StatsCard
                    title="Low Stock Options"
                    value={(lowStockCount || 0).toString()}
                    icon={AlertTriangle}
                    trend="neutral"
                />
                <StatsCard
                    title="Out of Stock"
                    value={(outOfStockCount || 0).toString()}
                    icon={AlertOctagon}
                    trend="down"
                />
            </div>

            <div className="bg-white rounded-lg border shadow-sm p-6">
                <InventoryTable initialProducts={products} />
            </div>
        </div>
    );
}
