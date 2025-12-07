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

const steps = [
    { id: 1, name: "1. Basic Information" },
    { id: 2, name: "2. Pricing & Inventory" },
    { id: 3, name: "3. Organization" },
]

export function AddProductForm() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1)
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        subCategory: "", // Kept for UI, but might not be in payload if backend doesn't need it
        sale_price: "",
        market_price: "",
        stock: "",
        status: "Active",
        image: "",
        colorHex: "#000000",
        colorText: "Black",
        size: "M",
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

    const updateData = (key: string, value: any) => {
        setFormData((prev) => ({ ...prev, [key]: value }))
    }

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const payload = {
                name: formData.name,
                images: [
                    { url: formData.image, sort_order: 1 }
                ],
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
                category: formData.category, // This should be the UUID
            };

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
                            updateData={updateData}
                            categories={categories}
                        />
                    )}
                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <div className="space-y-1">
                                <h3 className="text-lg font-semibold">Pricing & Inventory</h3>
                                <p className="text-sm text-gray-500">Manage price, stock, and variants.</p>
                            </div>
                            <div className="grid gap-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Sale Price ($)</Label>
                                        <Input
                                            type="number"
                                            placeholder="0.00"
                                            value={formData.sale_price}
                                            onChange={(e) => updateData("sale_price", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Market Price ($)</Label>
                                        <Input
                                            type="number"
                                            placeholder="0.00"
                                            value={formData.market_price}
                                            onChange={(e) => updateData("market_price", e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Stock Quantity</Label>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        value={formData.stock}
                                        onChange={(e) => updateData("stock", e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-3 gap-4 border-t pt-4 mt-2">
                                    <div className="space-y-2">
                                        <Label>Size</Label>
                                        <Select
                                            value={formData.size}
                                            onValueChange={(value) => updateData("size", value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Size" />
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
                                            placeholder="e.g. Black"
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
                                                placeholder="#000000"
                                                value={formData.colorHex}
                                                onChange={(e) => updateData("colorHex", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
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
                                    onValueChange={(value) => updateData("status", value)}
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
                        </div>
                    )}
                </div>

                {/* Live Preview */}
                <div className="lg:col-span-1">
                    <LivePreview data={formData} />

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
