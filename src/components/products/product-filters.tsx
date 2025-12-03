import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Filter, Download } from "lucide-react"

export function ProductFilters() {
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
                <span className="text-sm text-gray-500 ml-2">Showing 1-10 of 150 products</span>
            </div>

            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Sort by:</span>
                <Select defaultValue="last-updated">
                    <SelectTrigger className="w-[140px] h-9">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="last-updated">Last updated</SelectItem>
                        <SelectItem value="price-asc">Price: Low to High</SelectItem>
                        <SelectItem value="price-desc">Price: High to Low</SelectItem>
                        <SelectItem value="name-asc">Name: A to Z</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}
