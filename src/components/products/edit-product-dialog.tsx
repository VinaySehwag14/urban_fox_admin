"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Product, Variant } from "@/types"
import { ImageUpload } from "./image-upload"
import { cn } from "@/lib/utils"

interface EditProductDialogProps {
    product: Product | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: () => void
}

export function EditProductDialog({ product, open, onOpenChange, onSuccess }: EditProductDialogProps) {
    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
    const [globalColors, setGlobalColors] = useState<{ id: string; name: string; hex_code: string }[]>([])
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
    const [newVariant, setNewVariant] = useState<any>({
        id: "",
        size: [], // Note: using array for size here to support multi-select like in AddProductForm
        colorText: "Black",
        colorHex: "#000000",
        stock: "0",
        market_price: "0",
        sale_price: "0",
        sku_code: "",
        image_url: ""
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resCat, resCol] = await Promise.all([
                    fetch("/api/categories"),
                    fetch("/api/colors")
                ])

                if (resCat.ok) {
                    const data = await resCat.json()
                    if (data.categories && Array.isArray(data.categories)) {
                        setCategories(data.categories)
                    } else if (Array.isArray(data)) {
                        setCategories(data)
                    }
                }

                if (resCol.ok) {
                    const colData = await resCol.json()
                    if (colData.colors && Array.isArray(colData.colors)) {
                        setGlobalColors(colData.colors)
                        if (colData.colors.length > 0) {
                            setNewVariant((prev: any) => ({
                                ...prev,
                                colorText: colData.colors[0].name,
                                colorHex: colData.colors[0].hex_code
                            }))
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to fetch data", error)
            }
        }
        fetchData()
    }, [])

    useEffect(() => {
        if (product) {
            const p = product as any;
            console.log("Loading Product into Edit Dialog:", JSON.stringify(p, null, 2));
            
            // 1. Extract category ID - check multiple locations
            let categoryId = "";
            if (p.categories && Array.isArray(p.categories) && p.categories.length > 0) {
                // If the backend flattened it via transformedProducts
                categoryId = p.categories[0].id;
            } else if (typeof p.category === 'object' && p.category) {
                // If it's the raw Supabase response object
                categoryId = (p.category as any).id || "";
            } else if (typeof p.category === 'string') {
                // If it's just the ID string
                categoryId = p.category;
            }

            // 2. Extract Prices - handle both selling_price (modern) and sale_price (legacy)
            // Use logical OR to catch both undefined and null
            const salePrice = p.selling_price || p.sellingPrice || p.sale_price || p.price || "";
            const marketPrice = p.mrp || p.marketPrice || p.market_price || "";

            // 3. Extract Stock - handle explicit field or sum variants
            const variantStock = p.variants?.reduce((acc: number, v: any) => acc + (parseInt(v.stock_quantity) || parseInt(v.stock) || 0), 0) || 0;
            const currentStock = p.stock || p.inventory || (p.variants && p.variants.length > 0 ? variantStock : 0);

            // 4. Extract Image
            const imageUrl = p.image || (p.images && p.images.length > 0 ? (p.images[0].image_url || p.images[0].url) : "");

            setFormData({
                name: p.name || "",
                description: p.description || "",
                category: categoryId.toString(), // Ensure string for Select component
                sale_price: salePrice.toString(),
                market_price: marketPrice.toString(),
                stock: currentStock.toString(),
                status: typeof p.status === 'boolean'
                    ? (p.status ? "Active" : "Inactive")
                    : (p.status || "Active"),
                image: imageUrl,
                colorHex: "#000000",
                colorText: "Black",
                size: "M",
            });
            setVariants(p.variants || []);
        }
    }, [product])

    const handleSubmit = async () => {
        if (!product) return

        setLoading(true)
        try {
            const enrichedVariants = variants.map(v => {
                let hex = (v as any).colorHex;
                if (!hex && v.color) {
                    const globalMatch = globalColors.find(c => c.name === v.color);
                    if (globalMatch) hex = globalMatch.hex_code;
                }
                return {
                    ...v,
                    colorHex: hex || "#cccccc" // Fallback hex
                };
            });

            const payload = {
                name: formData.name,
                description: formData.description,
                selling_price: parseFloat(formData.sale_price) || 0,
                mrp: parseFloat(formData.market_price) || 0,
                // Note: stock is NOT sent here - it lives in product_variants.stock_quantity, not products table
                is_active: formData.status === "Active",
                category_ids: formData.category ? [formData.category] : [],
                images: formData.image ? [{ image_url: formData.image, is_primary: true }] : [],
                variants: enrichedVariants,
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

    const updateNewVariant = (key: string, value: any) => {
        setNewVariant((prev: any) => ({ ...prev, [key]: value }))
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
                        <Label>Total Stock (from variants)</Label>
                        <div className="flex items-center h-10 px-3 rounded-md border bg-gray-50 text-gray-500 text-sm">
                            {variants.reduce((acc, v: any) => acc + (parseInt(v.stock_quantity) || parseInt(v.stock) || 0), 0)} units across {variants.length} variant{variants.length !== 1 ? "s" : ""}
                        </div>
                        <p className="text-xs text-gray-400">Stock is managed per-variant. Use the variant editor below to update stock.</p>
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

                    </div>

                    {/* Add Variant Form */}
                    <div className="bg-gray-50 p-4 rounded-lg space-y-4 border mt-6">
                        <h4 className="text-sm font-medium">Bulk Variant Generator</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-4 col-span-2">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-white">
                                    <div className="space-y-2">
                                        <Label>Import Global Color</Label>
                                        <Select
                                            value={globalColors.find(c => c.name === newVariant.colorText)?.name || "custom"}
                                            onValueChange={(val) => {
                                                const selected = globalColors.find(c => c.name === val);
                                                if (selected) {
                                                    setNewVariant((prev: any) => ({
                                                        ...prev,
                                                        colorText: selected.name,
                                                        colorHex: selected.hex_code
                                                    }));
                                                } else {
                                                    setNewVariant((prev: any) => ({ ...prev, colorText: "", colorHex: "#000000" }));
                                                }
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select or Custom" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="custom">Custom Color...</SelectItem>
                                                {globalColors.map(c => (
                                                    <SelectItem key={c.id} value={c.name}>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: c.hex_code }} />
                                                            {c.name}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Color Name</Label>
                                        <Input
                                            placeholder="e.g. Neon Pink"
                                            value={newVariant.colorText}
                                            onChange={(e) => updateNewVariant("colorText", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Color Hex</Label>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="color"
                                                className="w-12 p-1 h-10 cursor-pointer rounded-md"
                                                value={newVariant.colorHex}
                                                onChange={(e) => updateNewVariant("colorHex", e.target.value)}
                                            />
                                            <Input
                                                value={newVariant.colorHex}
                                                onChange={(e) => updateNewVariant("colorHex", e.target.value)}
                                                className="font-mono flex-1"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2 col-span-2">
                                <Label>Sizes to Generate</Label>
                                <div className="flex flex-wrap gap-2">
                                    {["XS", "S", "M", "L", "XL", "XXL", "3XL"].map(s => {
                                        const selectedSizes = Array.isArray(newVariant.size) ? newVariant.size : [newVariant.size];
                                        const isSelected = selectedSizes.includes(s);
                                        return (
                                            <button
                                                key={s}
                                                type="button"
                                                onClick={() => {
                                                    if (isSelected) {
                                                        updateNewVariant("size", selectedSizes.filter((sz: any) => sz !== s) as any);
                                                    } else {
                                                        updateNewVariant("size", [...selectedSizes, s] as any);
                                                    }
                                                }}
                                                className={cn(
                                                    "px-3 py-1.5 rounded-md text-sm font-medium transition-colors border",
                                                    isSelected
                                                        ? "bg-[#1E88E5] text-white border-[#1E88E5]"
                                                        : "bg-white text-gray-700 hover:bg-gray-100 border-gray-200"
                                                )}
                                            >
                                                {s}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Default Stock per Size</Label>
                                <Input
                                    type="number"
                                    value={newVariant.stock}
                                    onChange={(e) => updateNewVariant("stock", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Default MRP (₹)</Label>
                                <Input
                                    type="number"
                                    value={newVariant.market_price}
                                    onChange={(e) => updateNewVariant("market_price", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Default Selling Price (₹)</Label>
                                <Input
                                    type="number"
                                    value={newVariant.sale_price}
                                    onChange={(e) => updateNewVariant("sale_price", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>SKU Pattern (Optional)</Label>
                                <Input
                                    value={newVariant.sku_code}
                                    onChange={(e) => updateNewVariant("sku_code", e.target.value)}
                                    placeholder="Auto-generated if empty"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Variant Image URL</Label>
                                <Input
                                    value={newVariant.image_url || ""}
                                    onChange={(e) => updateNewVariant("image_url", e.target.value)}
                                    placeholder="https://..."
                                />
                            </div>
                        </div>
                        <Button
                            onClick={() => {
                                const selectedSizes = Array.isArray(newVariant.size) ? newVariant.size : [newVariant.size];
                                if (selectedSizes.length === 0) {
                                    alert("Please select at least one size.");
                                    return;
                                }

                                const generatedVariants = selectedSizes.map((size: any) => {
                                    let sku = newVariant.sku_code;
                                    if (!sku) {
                                        const colorPrefix = newVariant.colorText.substring(0, 3).toUpperCase();
                                        const namePrefix = formData.name ? formData.name.substring(0, 3).toUpperCase() : "UF";
                                        const shortId = Math.random().toString(36).substring(2, 6).toUpperCase();
                                        sku = `${namePrefix}-${colorPrefix}-${size}-${shortId}`;
                                    } else {
                                        const shortId = Math.random().toString(36).substring(2, 6).toUpperCase();
                                        sku = `${sku}-${size}-${shortId}`;
                                    }

                                    return {
                                        ...newVariant,
                                        id: Math.random().toString(36).substr(2, 9),
                                        size,
                                        sku_code: sku,
                                        color: newVariant.colorText,         // Store colorText in `color` mapping
                                        mrp: parseFloat(newVariant.market_price) || 0,
                                        selling_price: parseFloat(newVariant.sale_price) || 0,
                                        stock_quantity: parseInt(newVariant.stock as string) || 0
                                    } as Variant;
                                });

                                setVariants([...variants, ...generatedVariants]);

                                // Clear forms
                                setNewVariant({
                                    ...newVariant,
                                    size: [] as any,
                                    sku_code: "",
                                    image_url: ""
                                });
                            }}
                            variant="secondary"
                            className="w-full bg-[#1E88E5]/10 text-[#1E88E5] hover:bg-[#1E88E5]/20 border border-[#1E88E5]/20"
                        >
                            <Plus className="w-4 h-4 mr-2" /> Generate {Array.isArray(newVariant.size) ? newVariant.size.length : 1} Variants
                        </Button>
                    </div>

                    {variants.length > 0 && (
                        <div className="space-y-3 pt-4 border-t mt-6">
                            <Label className="text-base font-semibold">Product Variants</Label>
                            <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
                                {Object.entries(variantsByColor).map(([colorName, group]) => (
                                    <div key={colorName} className="space-y-3 rounded-lg border border-gray-200 overflow-hidden">
                                        {/* Color Group Header & Image Upload */}
                                        <div className="bg-gray-50 p-4 border-b flex flex-col gap-4">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <div className="w-4 h-4 rounded-full border border-gray-200 shrink-0" style={{ backgroundColor: globalColors.find(c => c.name === colorName)?.hex_code || '#ccc' }} />
                                                    <h4 className="font-semibold text-gray-900 text-lg truncate">{colorName} Variants</h4>
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <Select
                                                        value={globalColors.find(c => c.name === colorName)?.name || "custom"}
                                                        onValueChange={(val) => {
                                                            if (val !== "custom") {
                                                                const updatedVariants = variants.map(v =>
                                                                    (v.color || "Default") === colorName ? { ...v, color: val } : v
                                                                );
                                                                setVariants(updatedVariants);
                                                            }
                                                        }}
                                                    >
                                                        <SelectTrigger className="w-[140px] h-9 bg-white text-sm">
                                                            <SelectValue placeholder="Change Color" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="custom">Custom...</SelectItem>
                                                            {globalColors.map(c => (
                                                                <SelectItem key={c.id} value={c.name}>
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="w-3 h-3 rounded-full border border-gray-200" style={{ backgroundColor: c.hex_code }} />
                                                                        {c.name}
                                                                    </div>
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>

                                                    {/* Custom Color Name Input */}
                                                    <Input
                                                        defaultValue={colorName}
                                                        key={`input-color-name-${colorName}`}
                                                        className="w-[120px] h-9 bg-white text-sm"
                                                        placeholder="Custom name"
                                                        onBlur={(e) => {
                                                            const newName = e.target.value.trim();
                                                            if (newName && newName !== colorName) {
                                                                const updatedVariants = variants.map(v =>
                                                                    (v.color || "Default") === colorName ? { ...v, color: newName } : v
                                                                );
                                                                setVariants(updatedVariants);
                                                            }
                                                        }}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') e.currentTarget.blur();
                                                        }}
                                                    />

                                                    {/* Color Hex Input (Only useful if it's a custom color, but we'll show it) */}
                                                    <div className="flex items-center gap-1">
                                                        <Input
                                                            type="color"
                                                            className="w-8 p-0 border-none h-9 cursor-pointer rounded-md bg-transparent"
                                                            value={group.variants[0]?.colorHex || globalColors.find(c => c.name === colorName)?.hex_code || '#cccccc'}
                                                            onChange={(e) => {
                                                                const newHex = e.target.value;
                                                                const updatedVariants = variants.map(v =>
                                                                    (v.color || "Default") === colorName ? { ...v, colorHex: newHex } : v
                                                                );
                                                                setVariants(updatedVariants);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="w-full space-y-2">
                                                <Label className="text-sm font-medium text-gray-700">Image for {colorName}</Label>
                                                <Input
                                                    className="w-full h-9 text-sm font-mono bg-white"
                                                    value={group.image_url}
                                                    onChange={(e) => {
                                                        const newUrl = e.target.value;
                                                        const updatedVariants = variants.map(v =>
                                                            (v.color || "Default") === colorName ? { ...v, image_url: newUrl } : v
                                                        );
                                                        setVariants(updatedVariants);
                                                    }}
                                                    placeholder="Paste image URL here..."
                                                />
                                                <div className="pt-2">
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

                                        {/* Sizes for this Color */}
                                        <div className="p-4 space-y-4">
                                            {group.variants.map((v) => (
                                                <div key={v.id || v.sku_code} className="p-3 bg-white border border-gray-100 rounded-lg shadow-sm hover:border-[#1E88E5]/50 transition-colors">
                                                    <div className="flex items-center justify-between mb-3 border-b pb-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm font-bold rounded-md">{v.size || "M"}</span>
                                                            <span className="text-xs text-gray-500 font-mono hidden sm:inline-block ml-2">{v.sku_code}</span>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8"
                                                            onClick={() => setVariants(variants.filter(va => va.id !== v.id && va.sku_code !== v.sku_code))}
                                                        >
                                                            Remove
                                                        </Button>
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                        <div className="space-y-1.5">
                                                            <Label className="text-xs text-gray-500">MRP (₹)</Label>
                                                            <Input
                                                                type="number"
                                                                className="h-8 text-sm"
                                                                value={v.mrp || 0}
                                                                onChange={(e) => {
                                                                    const updated = variants.map(va => (va.id === v.id || (va.sku_code && va.sku_code === v.sku_code)) ? { ...va, mrp: parseFloat(e.target.value) || 0 } : va);
                                                                    setVariants(updated);
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <Label className="text-xs text-gray-500">Sale Price (₹)</Label>
                                                            <Input
                                                                type="number"
                                                                className="h-8 text-sm"
                                                                value={v.selling_price || 0}
                                                                onChange={(e) => {
                                                                    const updated = variants.map(va => (va.id === v.id || (va.sku_code && va.sku_code === v.sku_code)) ? { ...va, selling_price: parseFloat(e.target.value) || 0 } : va);
                                                                    setVariants(updated);
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <Label className="text-xs text-gray-500">Stock</Label>
                                                            <Input
                                                                type="number"
                                                                className="h-8 text-sm"
                                                                value={v.stock_quantity || 0}
                                                                onChange={(e) => {
                                                                    const updated = variants.map(va => (va.id === v.id || (va.sku_code && va.sku_code === v.sku_code)) ? { ...va, stock_quantity: parseInt(e.target.value) || 0 } : va);
                                                                    setVariants(updated);
                                                                }}
                                                            />
                                                        </div>
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
