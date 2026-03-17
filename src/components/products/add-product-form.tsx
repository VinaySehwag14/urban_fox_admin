"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { BasicInfoStep } from "./steps/basic-info-step"
import { LivePreview } from "./live-preview"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"
import { ImageUpload } from "./image-upload"

const steps = [
    { id: 1, name: "1. Basic Information" },
    { id: 2, name: "2. Pricing & Variants" },
    { id: 3, name: "3. Organization" },
]

interface Variant {
    id: string; // Temp ID for UI
    size: string;
    colorText: string;
    colorHex: string;
    stock: string;
    market_price: string;
    sale_price: string;
    sku_code: string;
    image_url?: string;
}

export function AddProductForm() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1)
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
    const [globalColors, setGlobalColors] = useState<{ id: string; name: string; hex_code: string }[]>([]);

    // Base Product Data
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        brand: "Urban Fox", // Default brand
        status: "Active",
        images: [] as string[], // Changed from single image string to array
    })

    // Variants Data
    const [variants, setVariants] = useState<Variant[]>([])

    // Steps for Pricing/Inventory are now just for adding variants
    // We will keep a "temp" variant state for the input fields
    const [newVariant, setNewVariant] = useState<Variant>({
        id: "",
        size: "M",
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
                ]);

                if (resCat.ok) {
                    const data = await resCat.json();
                    if (data.categories && Array.isArray(data.categories)) {
                        setCategories(data.categories);
                    } else if (Array.isArray(data)) {
                        setCategories(data);
                    }
                }

                if (resCol.ok) {
                    const colData = await resCol.json();
                    if (colData.colors && Array.isArray(colData.colors)) {
                        setGlobalColors(colData.colors);
                        // Auto-select first color if available
                        if (colData.colors.length > 0) {
                            setNewVariant(prev => ({
                                ...prev,
                                colorText: colData.colors[0].name,
                                colorHex: colData.colors[0].hex_code
                            }));
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to fetch initial data", error);
            }
        };
        fetchData();
    }, []);

    const updateFormData = (key: string, value: any) => {
        setFormData((prev) => ({ ...prev, [key]: value }))
    }

    const updateNewVariant = (key: keyof Variant, value: any) => {
        setNewVariant((prev) => ({ ...prev, [key]: value }))
    }

    const addVariant = () => {
        if (!newVariant.sku_code) {
            // Auto-generate SKU if empty
            const sku = `${formData.name.substring(0, 3).toUpperCase()}-${newVariant.colorText.substring(0, 3).toUpperCase()}-${newVariant.size}`;
            newVariant.sku_code = sku;
        }

        setVariants([...variants, { ...newVariant, id: Math.random().toString(36).substr(2, 9) }]);
        // Reset new variant fields (keep some defaults if needed)
        setNewVariant({
            ...newVariant,
            stock: "0",
            sku_code: ""
        });
    }

    const removeVariant = (id: string) => {
        setVariants(variants.filter(v => v.id !== id));
    }

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // Validation: Ensure at least one variant is added
            if (variants.length === 0) {
                alert("Please add at least one variant with pricing information before publishing.");
                setLoading(false);
                return;
            }

            // Validation: Check if name is provided
            if (!formData.name.trim()) {
                alert("Product name is required.");
                setLoading(false);
                return;
            }

            // Validation: Check if first variant has valid prices
            const firstVariant = variants[0];
            const mrpValue = parseFloat(firstVariant.market_price);
            const sellingPriceValue = parseFloat(firstVariant.sale_price);

            if (!mrpValue || mrpValue <= 0) {
                alert("MRP (Market Price) must be greater than 0.");
                setLoading(false);
                return;
            }

            if (!sellingPriceValue || sellingPriceValue <= 0) {
                alert("Selling Price must be greater than 0.");
                setLoading(false);
                return;
            }

            // Validation: Ensure all SKU codes are unique
            const computedVariants = variants.map(v => {
                let finalSku = v.sku_code;
                if (!finalSku) {
                    const colorPrefix = v.colorText.substring(0, 3).toUpperCase();
                    const namePrefix = formData.name ? formData.name.substring(0, 3).toUpperCase() : "UF";
                    const shortId = Math.random().toString(36).substring(2, 6).toUpperCase();
                    finalSku = `${namePrefix}-${colorPrefix}-${v.size}-${shortId}`;
                }
                return {
                    color: v.colorText,
                    colorHex: v.colorHex,
                    size: v.size,
                    stock_quantity: parseInt(v.stock) || 0,
                    sku_code: finalSku,
                    mrp: parseFloat(v.market_price) || 0,
                    selling_price: parseFloat(v.sale_price) || 0,
                    image_url: v.image_url || undefined
                };
            });

            const skuSet = new Set(computedVariants.map(v => v.sku_code));
            if (skuSet.size !== computedVariants.length) {
                alert("Duplicate SKU codes detected among your variants. Please ensure each variant (Size/Color) has a uniquely generated or manual SKU pattern.");
                setLoading(false);
                return;
            }

            const payload = {
                name: formData.name,
                description: formData.description,
                brand: formData.brand,
                mrp: mrpValue,
                selling_price: sellingPriceValue, // Changed from sale_price to selling_price
                is_featured: false,
                category_ids: formData.category ? [formData.category] : [],
                tag_ids: [], // TODO: Add tags support
                images: formData.images.map((url, index) => ({
                    image_url: url,
                    is_primary: index === 0 // First image is primary
                })),
                variants: computedVariants
            };

            console.log("Submitting payload:", payload); // Debug log

            const res = await fetch("/api/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                router.push("/products");
                router.refresh();
            } else {
                const data = await res.json();
                alert(data.error || "Failed to create product");
            }
        } catch (error) {
            console.error("Failed to create product", error);
            alert("An error occurred while creating the product. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        if (currentStep === 3) {
            handleSubmit();
        } else {
            setCurrentStep(Math.min(3, currentStep + 1));
        }
    };

    // Helper for LivePreview data shape
    const previewData = {
        ...formData,
        sale_price: variants[0]?.sale_price || newVariant.sale_price || "0",
        market_price: variants[0]?.market_price || newVariant.market_price || "0",
        stock: variants.reduce((acc, v) => acc + (parseInt(v.stock) || 0), 0) + (parseInt(newVariant.stock) || 0),
        colorHex: variants[0]?.colorHex || newVariant.colorHex,
        size: variants[0]?.size || newVariant.size,
        image: formData.images[0] || "" // Use first image for preview
    };

    // Group variants by color for easier image assignment
    const variantsByColor = variants.reduce((acc, variant) => {
        if (!acc[variant.colorText]) {
            acc[variant.colorText] = {
                hex: variant.colorHex,
                variants: [],
                image_url: variant.image_url || "" // Take first image_url found for this color
            };
        }
        acc[variant.colorText].variants.push(variant);
        // If we hadn't found an image yet, and this variant has one, grab it
        if (!acc[variant.colorText].image_url && variant.image_url) {
            acc[variant.colorText].image_url = variant.image_url;
        }
        return acc;
    }, {} as Record<string, { hex: string, variants: Variant[], image_url: string }>);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
            </div>

            {/* Steps */}
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                {steps.map((step) => (
                    <button
                        key={step.id}
                        onClick={() => setCurrentStep(step.id)}
                        className={cn(
                            "flex-1 py-2 text-sm font-medium rounded-md transition-all",
                            currentStep === step.id
                                ? "bg-white text-[#1E88E5] shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                        )}
                    >
                        {step.name}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Area */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border shadow-sm">
                    {currentStep === 1 && (
                        <BasicInfoStep
                            data={formData}
                            updateData={updateFormData}
                            categories={categories}
                        />
                    )}
                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <div className="space-y-1">
                                <h3 className="text-lg font-semibold">Pricing & Variants</h3>
                                <p className="text-sm text-gray-500">Add variants (Size/Color) with specific pricing.</p>
                            </div>

                            {/* Add Variant Form */}
                            <div className="bg-gray-50 p-4 rounded-lg space-y-4 border">
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
                                                            setNewVariant(prev => ({
                                                                ...prev,
                                                                colorText: selected.name,
                                                                colorHex: selected.hex_code
                                                            }));
                                                        } else {
                                                            setNewVariant(prev => ({ ...prev, colorText: "", colorHex: "#000000" }));
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
                                                // Handle `size` field as an array internally just for UI selection
                                                const selectedSizes = Array.isArray(newVariant.size) ? newVariant.size : [newVariant.size];
                                                const isSelected = selectedSizes.includes(s);
                                                return (
                                                    <button
                                                        key={s}
                                                        type="button"
                                                        onClick={() => {
                                                            if (isSelected) {
                                                                updateNewVariant("size", selectedSizes.filter(sz => sz !== s) as any);
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
                                        <Label>Default MRP</Label>
                                        <Input
                                            type="number"
                                            value={newVariant.market_price}
                                            onChange={(e) => updateNewVariant("market_price", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Default Selling Price</Label>
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

                                        const generatedVariants = selectedSizes.map(size => {
                                            let sku = newVariant.sku_code;
                                            if (!sku) {
                                                const colorPrefix = newVariant.colorText.substring(0, 3).toUpperCase();
                                                const namePrefix = formData.name ? formData.name.substring(0, 3).toUpperCase() : "UF";
                                                const shortId = Math.random().toString(36).substring(2, 6).toUpperCase();
                                                sku = `${namePrefix}-${colorPrefix}-${size}-${shortId}`;
                                            } else {
                                                // If they provided a custom pattern, append size and ID
                                                const shortId = Math.random().toString(36).substring(2, 6).toUpperCase();
                                                sku = `${sku}-${size}-${shortId}`;
                                            }

                                            return {
                                                ...newVariant,
                                                id: Math.random().toString(36).substr(2, 9),
                                                size,
                                                sku_code: sku
                                            };
                                        });

                                        setVariants([...variants, ...generatedVariants]);

                                        // Clear only sizes and SKU to prep for next batch, keep price/color defaults for rapid entry
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

                            {/* Variants List with Inline Editing */}
                            <div className="space-y-3 pt-4 border-t">
                                <Label className="text-base">Generated Variants ({variants.length})</Label>
                                {variants.length === 0 ? (
                                    <div className="p-6 text-center border-2 border-dashed rounded-lg bg-gray-50">
                                        <p className="text-sm text-gray-500">No variants generated yet.</p>
                                        <p className="text-xs text-gray-400 mt-1">Use the bulk generator above to create sizes for a color quickly.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {Object.entries(variantsByColor).map(([colorText, group]) => (
                                            <div key={colorText} className="space-y-3 rounded-lg border border-gray-200 overflow-hidden">
                                                {/* Color Group Header & Image Upload */}
                                                <div className="bg-gray-50 p-4 border-b flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-6 h-6 rounded-full shadow-inner border border-black/10" style={{ backgroundColor: group.hex }} title={colorText} />
                                                        <h4 className="font-semibold text-gray-900 text-lg">{colorText} Variants</h4>
                                                    </div>
                                                    <div className="w-full md:w-[350px] space-y-2">
                                                        <Label className="text-xs text-gray-500">Image for {colorText} variant</Label>
                                                        <div className="flex items-center gap-2">
                                                            <Input
                                                                className="flex-1 h-8 text-xs font-mono bg-white"
                                                                value={group.image_url}
                                                                onChange={(e) => {
                                                                    const newUrl = e.target.value;
                                                                    const updatedVariants = variants.map(v =>
                                                                        v.colorText === colorText ? { ...v, image_url: newUrl } : v
                                                                    );
                                                                    setVariants(updatedVariants);
                                                                }}
                                                                placeholder="https://..."
                                                            />
                                                            <div className="w-[120px] shrink-0">
                                                                <ImageUpload
                                                                    value={group.image_url ? [group.image_url] : []}
                                                                    onChange={(urls) => {
                                                                        const url = urls.length > 0 ? urls[0] : "";
                                                                        const updatedVariants = variants.map(v =>
                                                                            v.colorText === colorText ? { ...v, image_url: url } : v
                                                                        );
                                                                        setVariants(updatedVariants);
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Sizes for this Color */}
                                                <div className="p-4 space-y-3">
                                                    {group.variants.map((v) => (
                                                        <div key={v.id} className="p-3 bg-white border border-gray-100 rounded-lg shadow-sm group hover:border-[#1E88E5]/50 transition-colors">
                                                            <div className="flex items-start justify-between mb-3">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-sm font-bold rounded-md">{v.size}</span>
                                                                    <span className="text-xs text-gray-500 ml-2 font-mono">{v.sku_code}</span>
                                                                </div>
                                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50 -mt-1 -mr-1" onClick={() => removeVariant(v.id)}>
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            </div>

                                                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                                                <div className="space-y-1">
                                                                    <Label className="text-xs text-gray-500">Stock</Label>
                                                                    <Input
                                                                        type="number"
                                                                        className="h-8 text-sm"
                                                                        value={v.stock}
                                                                        onChange={(e) => {
                                                                            const updatedVariants = variants.map(variant => variant.id === v.id ? { ...variant, stock: e.target.value } : variant);
                                                                            setVariants(updatedVariants);
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <Label className="text-xs text-gray-500">MRP (₹)</Label>
                                                                    <Input
                                                                        type="number"
                                                                        className="h-8 text-sm"
                                                                        value={v.market_price}
                                                                        onChange={(e) => {
                                                                            const updatedVariants = variants.map(variant => variant.id === v.id ? { ...variant, market_price: e.target.value } : variant);
                                                                            setVariants(updatedVariants);
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <Label className="text-xs text-gray-500">Selling Price (₹)</Label>
                                                                    <Input
                                                                        type="number"
                                                                        className="h-8 text-sm font-medium text-[#1E88E5]"
                                                                        value={v.sale_price}
                                                                        onChange={(e) => {
                                                                            const updatedVariants = variants.map(variant => variant.id === v.id ? { ...variant, sale_price: e.target.value } : variant);
                                                                            setVariants(updatedVariants);
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className="space-y-1 col-span-3 sm:col-span-1">
                                                                    <Label className="text-xs text-gray-500">SKU Overwrite</Label>
                                                                    <Input
                                                                        className="h-8 text-xs font-mono"
                                                                        value={v.sku_code}
                                                                        onChange={(e) => {
                                                                            const updatedVariants = variants.map(variant => variant.id === v.id ? { ...variant, sku_code: e.target.value } : variant);
                                                                            setVariants(updatedVariants);
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
                                )}
                            </div>
                        </div>
                    )}
                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <div className="space-y-1">
                                <h3 className="text-lg font-semibold">Organization</h3>
                                <p className="text-sm text-gray-500">Set availability and status.</p>
                            </div>
                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(value) => updateFormData("status", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Draft">Draft</SelectItem>
                                        <SelectItem value="Inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Brand</Label>
                                <Input
                                    value={formData.brand}
                                    onChange={(e) => updateFormData("brand", e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Live Preview */}
                <div className="lg:col-span-1">
                    <LivePreview data={previewData} />

                    <div className="mt-6 flex items-center gap-3">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                            disabled={currentStep === 1 || loading}
                        >
                            Previous
                        </Button>
                        <Button
                            className="flex-1 bg-[#1E88E5] hover:bg-[#1976D2]"
                            onClick={handleNext}
                            disabled={loading}
                        >
                            {loading ? "Publishing..." : (currentStep === 3 ? "Publish Product" : "Next Step")}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
