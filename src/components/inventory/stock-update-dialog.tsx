"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface StockUpdateDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    productName: string;
    variantName?: string;
    currentStock: number;
    productId: string;
    variantId?: number;
    initialStock?: number;
    onSuccess?: () => void;
}

export function StockUpdateDialog({
    open,
    onOpenChange,
    productName,
    variantName,
    currentStock,
    productId,
    variantId,
    initialStock,
    onSuccess
}: StockUpdateDialogProps) {
    const [stock, setStock] = useState(initialStock?.toString() || "");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            setStock(initialStock?.toString() || currentStock.toString());
        }
    }, [open, initialStock, currentStock]);

    const handleSave = async () => {
        setLoading(true);
        try {
            // Updated Payload structure aligned with user spec
            const payload = {
                productId: productId, // Optional but good for validation
                variantId: variantId, // Required for variants
                stock: parseInt(stock) // Required
            };

            const res = await fetch("/api/inventory/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const err = await res.json();
                console.error("Update failed", err);
                alert("Failed to update stock: " + (err.error || "Unknown error"));
                return;
            }

            onOpenChange(false);
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error(error);
            alert("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Update Stock</DialogTitle>
                    <DialogDescription>
                        Adjust inventory for <span className="font-semibold text-gray-900">{productName}</span>
                        {variantName && <span className="block text-xs mt-1 text-gray-500">Variant: {variantName}</span>}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="stock" className="text-right">
                            Quantity
                        </Label>
                        <Input
                            id="stock"
                            type="number"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>Cancel</Button>
                    <Button type="submit" onClick={handleSave} disabled={loading} className="bg-[#F59827] hover:bg-[#E08718]">
                        {loading ? "Saving..." : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
