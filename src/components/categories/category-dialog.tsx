"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Category {
    id?: string;
    name: string;
    image: string;
}

interface CategoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    category?: Category | null;
    onSave: (category: Category) => Promise<void>;
}

export function CategoryDialog({
    open,
    onOpenChange,
    category,
    onSave,
}: CategoryDialogProps) {
    const [formData, setFormData] = useState<Category>({
        name: "",
        image: "",
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (category) {
            setFormData({
                name: category.name,
                image: category.image,
            });
        } else {
            setFormData({
                name: "",
                image: "",
            });
        }
    }, [category, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSave({ ...formData, id: category?.id });
            onOpenChange(false);
        } catch (error) {
            console.error("Failed to save category", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{category ? "Edit Category" : "Add Category"}</DialogTitle>
                    <DialogDescription>
                        {category
                            ? "Make changes to the category here."
                            : "Add a new category to the store."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="image" className="text-right">
                                Image URL
                            </Label>
                            <Input
                                id="image"
                                value={formData.image}
                                onChange={(e) =>
                                    setFormData({ ...formData, image: e.target.value })
                                }
                                className="col-span-3"
                                required
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Save changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
