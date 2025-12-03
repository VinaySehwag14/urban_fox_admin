import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit2, Trash2, Shirt, ShoppingBag } from "lucide-react"
import { Category } from "@/types"

const categories: Category[] = [
    {
        id: "1",
        name: "T-Shirts",
        icon: "shirt",
        displayOrder: 1,
    },
    {
        id: "2",
        name: "Hoodies",
        icon: "hoodie",
        displayOrder: 2,
    },
    {
        id: "3",
        name: "Sweatshirts",
        icon: "sweatshirt",
        displayOrder: 3,
    },
    {
        id: "4",
        name: "Oversized",
        icon: "oversized",
        displayOrder: 4,
    },
    {
        id: "5",
        name: "Festive Seasonal",
        icon: "festive",
        displayOrder: 5,
    },
]

export function CategoriesTable() {
    return (
        <div className="bg-white rounded-lg border shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>CATEGORY NAME</TableHead>
                        <TableHead>ICON</TableHead>
                        <TableHead>DISPLAY ORDER</TableHead>
                        <TableHead className="text-right">ACTIONS</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {categories.map((category) => (
                        <TableRow key={category.id}>
                            <TableCell className="font-medium text-gray-900">{category.name}</TableCell>
                            <TableCell>
                                <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                                    {/* Placeholder icons based on name for now */}
                                    {category.icon === 'shirt' && '👕'}
                                    {category.icon === 'hoodie' && '🧥'}
                                    {category.icon === 'sweatshirt' && '👔'}
                                    {category.icon === 'oversized' && '👘'}
                                    {category.icon === 'festive' && '🎄'}
                                </div>
                            </TableCell>
                            <TableCell className="text-gray-600">{category.displayOrder}</TableCell>
                            <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-900">
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-center py-4 border-t">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled>
                        &lt;
                    </Button>
                    <Button variant="default" size="sm" className="h-8 w-8 p-0 bg-[#1E88E5] hover:bg-[#1976D2]">
                        1
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        2
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        3
                    </Button>
                    <span className="text-gray-400">...</span>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        10
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        &gt;
                    </Button>
                </div>
            </div>
        </div>
    )
}
