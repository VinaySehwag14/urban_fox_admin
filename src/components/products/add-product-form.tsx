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
}

export function AddProductForm() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1)
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

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
        sku_code: ""
    })

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch("/api/categories");
                if (res.ok) {
                    const data = await res.json();
                    if (data.categories && Array.isArray(data.categories)) {
                        setCategories(data.categories);
                    } else if (Array.isArray(data)) {
                        setCategories(data);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch categories", error);
            }
        };
        fetchCategories();
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
                variants: variants.map(v => ({
                    color: v.colorText,
                    size: v.size,
                    stock_quantity: parseInt(v.stock) || 0,
                    sku_code: v.sku_code || `${formData.name.substring(0, 3).toUpperCase()}-${v.colorText.substring(0, 3).toUpperCase()}-${v.size}`,
                    mrp: parseFloat(v.market_price) || 0,
                    selling_price: parseFloat(v.sale_price) || 0 // Changed from sale_price to selling_price
                }))
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
                                <h4 className="text-sm font-medium">Add New Variant</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Color Name</Label>
                                        <Input
                                            placeholder="e.g. Black"
                                            value={newVariant.colorText}
                                            onChange={(e) => updateNewVariant("colorText", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Color Hex</Label>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="color"
                                                className="w-12 p-1 h-10"
                                                value={newVariant.colorHex}
                                                onChange={(e) => updateNewVariant("colorHex", e.target.value)}
                                            />
                                            <Input
                                                value={newVariant.colorHex}
                                                onChange={(e) => updateNewVariant("colorHex", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Size</Label>
                                        <Select
                                            value={newVariant.size}
                                            onValueChange={(value) => updateNewVariant("size", value)}
                                        >
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                {["XS", "S", "M", "L", "XL", "XXL"].map(s => (
                                                    <SelectItem key={s} value={s}>{s}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Stock</Label>
                                        <Input
                                            type="number"
                                            value={newVariant.stock}
                                            onChange={(e) => updateNewVariant("stock", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>MRP</Label>
                                        <Input
                                            type="number"
                                            value={newVariant.market_price}
                                            onChange={(e) => updateNewVariant("market_price", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Selling Price</Label>
                                        <Input
                                            type="number"
                                            value={newVariant.sale_price}
                                            onChange={(e) => updateNewVariant("sale_price", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>SKU (Optional)</Label>
                                        <Input
                                            value={newVariant.sku_code}
                                            onChange={(e) => updateNewVariant("sku_code", e.target.value)}
                                            placeholder="Auto-generated if empty"
                                        />
                                    </div>
                                </div>
                                <Button onClick={addVariant} variant="secondary" className="w-full">
                                    <Plus className="w-4 h-4 mr-2" /> Add Variant
                                </Button>
                            </div>

                            {/* Variants List */}
                            <div className="space-y-2">
                                <Label>Added Variants ({variants.length})</Label>
                                {variants.length === 0 ? (
                                    <p className="text-sm text-gray-400 italic">No variants added yet.</p>
                                ) : (
                                    <div className="space-y-2">
                                        {variants.map((v) => (
                                            <div key={v.id} className="flex items-center justify-between p-3 bg-white border rounded-md">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: v.colorHex }} />
                                                    <span className="font-medium text-sm">{v.colorText} - {v.size}</span>
                                                    <span className="text-xs text-gray-500">Stock: {v.stock} | ₹{v.sale_price}</span>
                                                </div>
                                                <Button size="icon" variant="ghost" className="text-red-500 h-8 w-8" onClick={() => removeVariant(v.id)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
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
