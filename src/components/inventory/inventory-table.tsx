"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, AlertTriangle } from "lucide-react";
import { Product, Variant } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StockUpdateDialog } from "./stock-update-dialog";

interface InventoryTableProps {
    initialProducts: Product[];
}

// Helper type for flattened rows
interface InventoryRow {
    id: string; // Composite ID for key
    productId: string; // The backend numeric ID as string or number
    variantId?: number; // Optional variant ID
    name: string;
    sku: string;
    category: string;
    price: number;
    stock: number;
    image: string;
    isVariant: boolean;
    variantName?: string; // Additional info like "Size: M, Color: Red"
}

export function InventoryTable({ initialProducts }: InventoryTableProps) {
    const [searchTerm, setSearchTerm] = useState("");

    // Flatten products and variants into a single list for the table
    const flattenedRows: InventoryRow[] = (initialProducts || []).flatMap(product => {
        if (!product) return []; // Defensive check

        const baseImage = (product.images && product.images.length > 0)
            ? product.images[0].image_url
            : product.image;

        const categoryName = (product.categories && product.categories.length > 0)
            ? product.categories[0].name
            : (typeof product.category === 'object' && product.category ? (product.category as any).name : String(product.category || "Uncategorized"));

        if (product.variants && product.variants.length > 0) {
            return product.variants.map(variant => ({
                id: `${product.id}-v-${variant.id}`,
                productId: String(product.id),
                variantId: variant.id,
                name: product.name,
                sku: variant.sku_code || "N/A",
                category: categoryName,
                price: Number(variant.selling_price || product.selling_price || 0),
                stock: variant.stock_quantity || 0,
                image: baseImage || "",
                isVariant: true,
                variantName: `${variant.size || ""} ${variant.color || ""}`.trim() || "Variant"
            }));
        } else {
            return [{
                id: String(product.id),
                productId: String(product.id),
                variantId: undefined, // Explicitly undefined for main product
                name: product.name,
                sku: product.qikink_sku || "N/A",
                category: categoryName,
                price: Number(product.selling_price || 0),
                stock: product.stock || 0,
                image: baseImage || "",
                isVariant: false
            }];
        }
    });

    const filteredRows = flattenedRows.filter(row =>
        row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // --- Stock Update Logic ---
    const [selectedRow, setSelectedRow] = useState<InventoryRow | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleEditStock = (row: InventoryRow) => {
        setSelectedRow(row);
        setIsDialogOpen(true);
    };

    const handleSuccess = () => {
        // In a real app, we might re-fetch data or update local state optimistically.
        // For now, refreshing the page is a simple way to sync.
        window.location.reload();
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="relative w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        placeholder="Search by name or SKU..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                {/* <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                </Button> */}
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>SKU</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Current Stock</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredRows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                    No inventory items found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredRows.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9 rounded-md border">
                                                <AvatarImage src={row.image} alt={row.name} />
                                                <AvatarFallback className="rounded-md">
                                                    {(row.name || "?").slice(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-sm text-gray-900">{row.name}</span>
                                                {row.isVariant && (
                                                    <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-sm w-fit mt-0.5">
                                                        {row.variantName}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-xs font-mono text-gray-600">{row.sku}</TableCell>
                                    <TableCell className="text-gray-600">{row.category}</TableCell>
                                    <TableCell className="font-medium">₹{row.price}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className={cn(
                                                "font-medium",
                                                row.stock === 0 ? "text-red-600" :
                                                    row.stock < 10 ? "text-orange-600" : "text-gray-900"
                                            )}>
                                                {row.stock}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {row.stock === 0 ? (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                                Out of Stock
                                            </span>
                                        ) : row.stock < 10 ? (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                                                <AlertTriangle className="w-3 h-3 mr-1" />
                                                Low Stock
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                                In Stock
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-8 text-xs bg-white hover:bg-gray-50"
                                            onClick={() => handleEditStock(row)}
                                        >
                                            Adjust
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {selectedRow && (
                <StockUpdateDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    productName={selectedRow.name}
                    variantName={selectedRow.isVariant ? selectedRow.variantName : undefined}
                    currentStock={selectedRow.stock}
                    productId={selectedRow.productId}
                    variantId={selectedRow.variantId}
                    initialStock={selectedRow.stock}
                    onSuccess={handleSuccess}
                />
            )}
        </div>
    );
}

// Utility for class merging (if not imported globally)
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
