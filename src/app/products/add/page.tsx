import { AddProductForm } from "@/components/products/add-product-form"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function AddProductPage() {
    return (
        <div className="space-y-6">
            {/* Top Action Bar */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>Dashboard</span>
                    <span>/</span>
                    <span>Products</span>
                    <span>/</span>
                    <span className="text-gray-900 font-medium">Add Product</span>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="bg-white">Save Draft</Button>
                    <Button className="bg-[#1E88E5] hover:bg-[#1976D2] gap-2">
                        <Plus className="h-4 w-4" />
                        Publish Product
                    </Button>
                </div>
            </div>

            <AddProductForm />
        </div>
    )
}
