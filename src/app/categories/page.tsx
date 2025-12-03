import { CategoriesHeader } from "@/components/categories/categories-header"
import { CategoriesTable } from "@/components/categories/categories-table"

export default function CategoriesPage() {
    return (
        <div className="space-y-6">
            <CategoriesHeader />
            <CategoriesTable />
        </div>
    )
}
