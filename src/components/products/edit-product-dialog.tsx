"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Product, Variant } from "@/types"
import { ImageUpload } from "./image-upload"

interface EditProductDialogProps {
    product: Product | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: () => void
}

export function EditProductDialog({ product, open, onOpenChange, onSuccess }: EditProductDialogProps) {
    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        sale_price: "",
        market_price: "",
        stock: "",
        status: "Active",
        image: "",
        colorHex: "#000000",
        colorText: "Black",
        size: "M",
    })
    const [variants, setVariants] = useState<Variant[]>([])

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch("/api/categories")
                if (res.ok) {
                    const data = await res.json()
                    if (data.categories && Array.isArray(data.categories)) {
                        setCategories(data.categories)
                    } else if (Array.isArray(data)) {
                        setCategories(data)
                    }
                }
            } catch (error) {
                console.error("Failed to fetch categories", error)
            }
        }
        fetchCategories()
    }, [])

    useEffect(() => {
        if (product) {
            const categoryId = typeof product.category === 'object' && product.category ? (product.category as any).id : product.category
            const imageUrl = product.image || (product.images && product.images.length > 0 ? product.images[0].image_url : "")

            setFormData({
                name: product.name || "",
                description: product.description || "",
                category: categoryId || "",
                sale_price: product.sale_price?.toString() || "",
                market_price: product.market_price?.toString() || "",
                stock: product.stock?.toString() || "",
                status: typeof product.status === 'boolean'
                    ? (product.status ? "Active" : "Inactive")
                    : (product.status || "Active"),
                image: imageUrl,
                colorHex: "#000000", // Default if not available
                colorText: "Black",
                size: "M",
            })
            setVariants(product.variants || [])
        }
    }, [product])

    const handleSubmit = async () => {
        if (!product) return

        setLoading(true)
        try {
            const payload = {
                name: formData.name,
                images: [{ url: formData.image, sort_order: 1 }],
                sale_price: parseFloat(formData.sale_price) || 0,
                market_price: parseFloat(formData.market_price) || 0,
                color: {
                    hex: formData.colorHex,
                    text: formData.colorText
                },
                size: formData.size,
                description: formData.description,
                stock: parseInt(formData.stock) || 0,
                is_active: formData.status === "Active",
                category: formData.category,
                variants: variants,
            }

            const res = await fetch(`/api/products/${product.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            })

            if (res.ok) {
                onSuccess()
                onOpenChange(false)
            } else {
                const data = await res.json()
                alert(data.error || "Failed to update product")
            }
        } catch (error) {
            console.error("Failed to update product", error)
            alert("Failed to update product")
        } finally {
            setLoading(false)
        }
    }

    const updateData = (key: string, value: any) => {
        setFormData((prev) => ({ ...prev, [key]: value }))
    }

    // Group variants by color for easier image assignment
    const variantsByColor = variants.reduce((acc, variant) => {
        const colorName = variant.color || "Default";
        if (!acc[colorName]) {
            acc[colorName] = {
                variants: [],
                image_url: variant.image_url || "" // Take first image_url found for this color
            };
        }
        acc[colorName].variants.push(variant);
        if (!acc[colorName].image_url && variant.image_url) {
            acc[colorName].image_url = variant.image_url;
        }
        return acc;
    }, {} as Record<string, { variants: Variant[], image_url: string }>);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Product</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Product Name</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => updateData("name", e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => updateData("description", e.target.value)}
                            className="min-h-[100px]"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Category</Label>
                            <Select
                                value={formData.category}
                                onValueChange={(value) => updateData("category", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories?.map((category) => (
                                        <SelectItem key={category.id} value={category.id}>
                                            {typeof category.name === 'object' ? JSON.stringify(category.name) : category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value) => updateData("status", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Active">Active</SelectItem>
                                    <SelectItem value="Draft">Draft</SelectItem>
                                    <SelectItem value="Inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Sale Price (₹)</Label>
                            <Input
                                type="number"
                                value={formData.sale_price}
                                onChange={(e) => updateData("sale_price", e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Market Price (₹)</Label>
                            <Input
                                type="number"
                                value={formData.market_price}
                                onChange={(e) => updateData("market_price", e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Stock Quantity</Label>
                        <Input
                            type="number"
                            value={formData.stock}
                            onChange={(e) => updateData("stock", e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Product Image URL</Label>
                        <Input
                            value={formData.image}
                            onChange={(e) => updateData("image", e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>Size</Label>
                            <Select
                                value={formData.size}
                                onValueChange={(value) => updateData("size", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="XS">XS</SelectItem>
                                    <SelectItem value="S">S</SelectItem>
                                    <SelectItem value="M">M</SelectItem>
                                    <SelectItem value="L">L</SelectItem>
                                    <SelectItem value="XL">XL</SelectItem>
                                    <SelectItem value="XXL">XXL</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Color Name</Label>
                            <Input
                                value={formData.colorText}
                                onChange={(e) => updateData("colorText", e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Color Hex</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="color"
                                    className="w-12 p-1 h-10"
                                    value={formData.colorHex}
                                    onChange={(e) => updateData("colorHex", e.target.value)}
                                />
                                <Input
                                    value={formData.colorHex}
                                    onChange={(e) => updateData("colorHex", e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {variants.length > 0 && (
                        <div className="space-y-3 pt-4 border-t mt-6">
                            <Label className="text-base font-semibold">Product Variants</Label>
                            <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
                                {Object.entries(variantsByColor).map(([colorName, group]) => (
                                    <div key={colorName} className="space-y-3 rounded-lg border border-gray-200 overflow-hidden">
                                        {/* Color Group Header & Image Upload */}
                                        <div className="bg-gray-50 p-3 border-b flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-semibold text-gray-900">{colorName} Variants</h4>
                                            </div>
                                            <div className="w-full sm:w-[350px] space-y-1.5">
                                                <Label className="text-xs text-gray-500">Image for {colorName}</Label>
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        className="flex-1 h-8 text-xs font-mono bg-white"
                                                        value={group.image_url}
                                                        onChange={(e) => {
                                                            const newUrl = e.target.value;
                                                            const updatedVariants = variants.map(v =>
                                                                (v.color || "Default") === colorName ? { ...v, image_url: newUrl } : v
                                                            );
                                                            setVariants(updatedVariants);
                                                        }}
                                                        placeholder="https://..."
                                                    />
                                                    <div className="w-[100px] shrink-0">
                                                        <ImageUpload
                                                            value={group.image_url ? [group.image_url] : []}
                                                            onChange={(urls) => {
                                                                const url = urls.length > 0 ? urls[0] : "";
                                                                const updatedVariants = variants.map(v =>
                                                                    (v.color || "Default") === colorName ? { ...v, image_url: url } : v
                                                                );
                                                                setVariants(updatedVariants);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Sizes for this Color */}
                                        <div className="p-3 space-y-2">
                                            {group.variants.map((v) => (
                                                <div key={v.id || v.sku_code} className="flex flex-wrap sm:flex-nowrap items-center gap-3 p-2 bg-white border border-gray-100 rounded-lg shadow-sm">
                                                    <div className="flex items-center gap-2 min-w-[80px]">
                                                        <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-sm font-bold rounded-md">{v.size || "M"}</span>
                                                    </div>
                                                    <div className="text-xs text-gray-500 flex-1 font-mono">{v.sku_code}</div>
                                                    <div className="flex gap-2 text-xs">
                                                        <span className="text-gray-500">MRP: <span className="text-gray-900 font-medium">₹{v.mrp}</span></span>
                                                        <span className="text-gray-500">Price: <span className="text-[#1E88E5] font-medium">₹{v.selling_price}</span></span>
                                                        <span className="text-gray-500">Stock: <span className="text-gray-900 font-medium">{v.stock_quantity}</span></span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-2">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-[#1E88E5] hover:bg-[#1976D2]"
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
