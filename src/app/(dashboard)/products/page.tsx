"use client";

import { useState, useEffect } from "react";
import { ProductHeader } from "@/components/products/product-header"
import { ProductFilters } from "@/components/products/product-filters"
import { ProductsTable } from "@/components/products/products-table"
import { EditProductDialog } from "@/components/products/edit-product-dialog"
import { Product } from "@/types";

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);

    const fetchProducts = async () => {
        try {
            const res = await fetch("/api/products");
            if (res.ok) {
                const data = await res.json();
                console.log("Products Data:", data); // Debug log
                if (Array.isArray(data)) {
                    setProducts(data);
                } else if (data.products && Array.isArray(data.products)) {
                    setProducts(data.products);
                } else {
                    setProducts([]);
                }
            }
        } catch (error) {
            console.error("Failed to fetch products", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDeleteProduct = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        try {
            const res = await fetch(`/api/products/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                fetchProducts();
            } else {
                alert("Failed to delete product");
            }
        } catch (error) {
            console.error("Failed to delete product", error);
        }
    };

    const [sortBy, setSortBy] = useState("last-updated");

    const getSortedProducts = () => {
        const sorted = [...products];
        switch (sortBy) {
            case "price-asc":
                return sorted.sort((a, b) => a.selling_price - b.selling_price);
            case "price-desc":
                return sorted.sort((a, b) => b.selling_price - a.selling_price);
            case "name-asc":
                return sorted.sort((a, b) => a.name.localeCompare(b.name));
            case "stock-asc":
                return sorted.sort((a, b) => a.stock - b.stock);
            case "stock-desc":
                return sorted.sort((a, b) => b.stock - a.stock);
            case "last-updated":
            default:
                // Assuming newer items are at the end or we sort by ID/time if available
                // For now, reverse to show newest first if no date field
                return sorted.reverse();
        }
    };

    const handleExport = () => {
        const headers = ["ID", "Name", "Sale Price", "Market Price", "Stock", "Status", "Category"];
        const csvContent = [
            headers.join(","),
            ...products.map(p => {
                const categoryName = p.categories && p.categories.length > 0
                    ? p.categories.map(c => c.name).join(", ")
                    : (typeof p.category === 'object' && p.category ? (p.category as any).name : p.category);
                return [
                    p.id,
                    `"${p.name.replace(/"/g, '""')}"`, // Escape quotes
                    p.selling_price,
                    p.mrp,
                    p.stock,
                    p.status,
                    `"${(categoryName || "").replace(/"/g, '""')}"`
                ].join(",");
            })
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "products.csv");
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const filteredProducts = getSortedProducts();

    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        setEditDialogOpen(true);
    };

    const handleEditSuccess = () => {
        fetchProducts();
    };

    return (
        <div className="space-y-6">
            <ProductHeader />
            <div className="bg-white p-6 rounded-xl border shadow-sm">
                <ProductFilters
                    count={filteredProducts.length}
                    onSortChange={setSortBy}
                    onExport={handleExport}
                />
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <ProductsTable
                        products={filteredProducts}
                        onDelete={handleDeleteProduct}
                        onEdit={handleEditProduct}
                    />
                )}
            </div>
            <EditProductDialog
                product={editingProduct}
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                onSuccess={handleEditSuccess}
            />
        </div>
    )
}
