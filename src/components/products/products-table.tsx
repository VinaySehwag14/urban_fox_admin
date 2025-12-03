import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Edit2, Trash2, Copy } from "lucide-react"
import { Product } from "@/types"
import Image from "next/image"

const products: Product[] = [
    {
        id: "1",
        name: "Vintage Graphic T-Shirt",
        category: "T-Shirts",
        price: 29.99,
        stock: 150,
        status: "Active",
        image: "/placeholder.png", // Using placeholder for now
        lastUpdated: "2023-10-25",
    },
    {
        id: "2",
        name: "Classic Pullover Hoodie",
        category: "Hoodies",
        price: 54.99,
        stock: 88,
        status: "Active",
        image: "/placeholder.png",
        lastUpdated: "2023-10-24",
    },
    {
        id: "3",
        name: "Winter Festive Sweatshirt",
        category: "Seasonal",
        price: 49.99,
        stock: 0,
        status: "Inactive",
        image: "/placeholder.png",
        lastUpdated: "2023-10-23",
    },
    {
        id: "4",
        name: "Oversized Crewneck",
        category: "Oversized",
        price: 45.00,
        stock: 12,
        status: "Active",
        image: "/placeholder.png",
        lastUpdated: "2023-10-22",
    },
    {
        id: "5",
        name: "Essential Cotton T-Shirt",
        category: "T-Shirts",
        price: 24.99,
        stock: 250,
        status: "Active",
        image: "/placeholder.png",
        lastUpdated: "2023-10-21",
    },
]

export function ProductsTable() {
    return (
        <div className="bg-white rounded-lg border shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px]">
                            <Checkbox />
                        </TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell>
                                <Checkbox />
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 relative rounded-md overflow-hidden bg-gray-100">
                                        {/* Placeholder for image */}
                                        <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400">Img</div>
                                    </div>
                                    <span className="font-medium text-gray-900">{product.name}</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-gray-600">{product.category}</TableCell>
                            <TableCell className="font-medium">${product.price.toFixed(2)}</TableCell>
                            <TableCell>
                                {product.stock === 0 ? (
                                    <span className="text-red-500 font-medium">Out of stock</span>
                                ) : product.stock < 20 ? (
                                    <span className="text-orange-500 font-medium">{product.stock} in stock</span>
                                ) : (
                                    <span className="text-gray-600">{product.stock} in stock</span>
                                )}
                            </TableCell>
                            <TableCell>
                                <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.status === "Active"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-gray-100 text-gray-800"
                                        }`}
                                >
                                    {product.status}
                                </span>
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-900">
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-900">
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50">
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
                        15
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        &gt;
                    </Button>
                </div>
            </div>
        </div>
    )
}
