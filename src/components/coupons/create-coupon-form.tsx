"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Sparkles } from "lucide-react"

export function CreateCouponForm() {
    const [formData, setFormData] = useState({
        code: "",
        discountType: "percentage",
        discountValue: "",
        limitUse: "",
        expiryDate: "",
    })

    const updateData = (key: string, value: any) => {
        setFormData((prev) => ({ ...prev, [key]: value }))
    }

    const generateCode = () => {
        const randomCode = "SAMPLE" + Math.floor(Math.random() * 10000)
        updateData("code", randomCode)
    }

    return (
        <div className="bg-white rounded-xl border shadow-sm p-6 space-y-6">
            {/* Coupon Details */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Coupon Details</h3>

                <div className="space-y-2">
                    <Label htmlFor="code">Coupon Code</Label>
                    <div className="flex gap-2">
                        <Input
                            id="code"
                            placeholder="e.g., SAMPLE2024"
                            value={formData.code}
                            onChange={(e) => updateData("code", e.target.value)}
                            className="flex-1"
                        />
                        <Button
                            variant="outline"
                            onClick={generateCode}
                            className="gap-2"
                        >
                            <Sparkles className="h-4 w-4" />
                            Generate
                        </Button>
                    </div>
                </div>
            </div>

            {/* Discount Configuration */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Discount Configuration</h3>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Discount Type</Label>
                        <Select
                            value={formData.discountType}
                            onValueChange={(value) => updateData("discountType", value)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="percentage">Percentage</SelectItem>
                                <SelectItem value="flat">Flat Amount</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Discount Value</Label>
                        <Input
                            type="number"
                            placeholder={formData.discountType === "percentage" ? "20" : "50"}
                            value={formData.discountValue}
                            onChange={(e) => updateData("discountValue", e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Usage Rules */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Usage Rules</h3>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Limit Use</Label>
                        <Input
                            placeholder="100"
                            value={formData.limitUse}
                            onChange={(e) => updateData("limitUse", e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Expiry Date</Label>
                        <Input
                            type="date"
                            value={formData.expiryDate}
                            onChange={(e) => updateData("expiryDate", e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
