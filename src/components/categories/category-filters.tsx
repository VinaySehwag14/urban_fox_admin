import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Filter, Download } from "lucide-react"

interface CategoryFiltersProps {
    count: number;
}

export function CategoryFilters({ count }: CategoryFiltersProps) {
    return (
        <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-9 gap-2">
                    <Filter className="h-4 w-4" />
                    Filter
                </Button>
                <Button variant="ghost" size="sm" className="h-9 gap-2 text-gray-500">
                    <Download className="h-4 w-4" />
                    Export
                </Button>
                <span className="text-sm text-gray-500 ml-2">Showing {count} categories</span>
            </div>

            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Sort by:</span>
                <Select defaultValue="name-asc">
                    <SelectTrigger className="w-[140px] h-9">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="name-asc">Name: A to Z</SelectItem>
                        <SelectItem value="name-desc">Name: Z to A</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}
