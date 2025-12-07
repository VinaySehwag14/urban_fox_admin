import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface CategoryHeaderProps {
    onAdd: () => void;
}

export function CategoryHeader({ onAdd }: CategoryHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
            <div className="flex items-center gap-3">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search categories..."
                        className="w-64 pl-9 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59827] focus:border-transparent"
                    />
                    <svg
                        className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>
                <Button
                    className="bg-[#1E88E5] hover:bg-[#1976D2] text-white gap-2"
                    onClick={onAdd}
                >
                    <Plus className="h-4 w-4" />
                    Add Category
                </Button>
            </div>
        </div>
    )
}
