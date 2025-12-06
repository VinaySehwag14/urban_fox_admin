import { ProductHeader } from "@/components/products/product-header"
import { ProductFilters } from "@/components/products/product-filters"
import { ProductsTable } from "@/components/products/products-table"

export default function ProductsPage() {
    return (
        <div className="space-y-6">
            <ProductHeader />
            <div className="bg-white p-6 rounded-xl border shadow-sm">
                <ProductFilters />
                <ProductsTable />
            </div>
        </div>
    )
}
