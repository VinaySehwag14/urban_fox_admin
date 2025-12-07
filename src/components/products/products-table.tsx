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

interface ProductsTableProps {
    products: Product[];
    onDelete: (id: string) => void;
    onEdit: (product: Product) => void;
}

export function ProductsTable({ products, onDelete, onEdit }: ProductsTableProps) {
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
                    {products.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center py-10">
                                No products found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>
                                    <Checkbox />
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 relative rounded-md overflow-hidden bg-gray-100">
                                            {(product.image || (product.images && product.images.length > 0 && product.images[0].url)) ? (
                                                <img
                                                    src={product.image || product.images![0].url}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400">Img</div>
                                            )}
                                        </div>
                                        <span className="font-medium text-gray-900">{product.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-gray-600">
                                    {typeof product.category === 'object' && product.category !== null
                                        ? (product.category as any).name
                                        : product.category}
                                </TableCell>
                                <TableCell className="font-medium">
                                    <div className="flex flex-col">
                                        <span className="font-bold">${Number(product.sale_price || 0).toFixed(2)}</span>
                                        {product.market_price > product.sale_price && (
                                            <span className="text-xs text-gray-400 line-through">
                                                ${Number(product.market_price || 0).toFixed(2)}
                                            </span>
                                        )}
                                    </div>
                                </TableCell>
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
                                        {product.status || 'Active'}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-gray-500 hover:text-gray-900"
                                            onClick={() => onEdit(product)}
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-900">
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                            onClick={() => onDelete(product.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
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
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled>
                        &gt;
                    </Button>
                </div>
            </div>
        </div>
    )
}
