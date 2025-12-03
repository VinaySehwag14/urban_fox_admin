"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BasicInfoStep } from "./steps/basic-info-step"
import { LivePreview } from "./live-preview"
import { cn } from "@/lib/utils"

const steps = [
    { id: 1, name: "1. Basic Information" },
    { id: 2, name: "2. Pricing & Inventory" },
    { id: 3, name: "3. Organization" },
]

export function AddProductForm() {
    const [currentStep, setCurrentStep] = useState(1)
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        subCategory: "",
        price: "",
    })

    const updateData = (key: string, value: any) => {
        setFormData((prev) => ({ ...prev, [key]: value }))
    }

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
                        <BasicInfoStep data={formData} updateData={updateData} />
                    )}
                    {currentStep === 2 && (
                        <div className="text-center py-12 text-gray-500">
                            Pricing & Inventory step content goes here
                        </div>
                    )}
                    {currentStep === 3 && (
                        <div className="text-center py-12 text-gray-500">
                            Organization step content goes here
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
                            disabled={currentStep === 1}
                        >
                            Previous
                        </Button>
                        <Button
                            className="flex-1 bg-[#1E88E5] hover:bg-[#1976D2]"
                            onClick={() => setCurrentStep(Math.min(3, currentStep + 1))}
                        >
                            {currentStep === 3 ? "Publish Product" : "Next Step"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
