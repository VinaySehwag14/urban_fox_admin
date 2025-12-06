"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CategoryTable } from "@/components/categories/category-table";
import { CategoryDialog } from "@/components/categories/category-dialog";

interface Category {
    id: string;
    name: string;
    image: string;
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    const fetchCategories = async () => {
        try {
            const res = await fetch("/api/categories");
            if (res.ok) {
                const data = await res.json();
                // Handle both array and { categories: [...] } formats
                if (data.categories && Array.isArray(data.categories)) {
                    setCategories(data.categories);
                } else if (Array.isArray(data)) {
                    setCategories(data);
                } else {
                    console.error("Expected array of categories, got:", data);
                    setCategories([]);
                }
            }
        } catch (error) {
            console.error("Failed to fetch categories", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAddCategory = () => {
        setSelectedCategory(null);
        setDialogOpen(true);
    };

    const handleEditCategory = (category: Category) => {
        setSelectedCategory(category);
        setDialogOpen(true);
    };

    const handleDeleteCategory = async (id: string) => {
        if (!confirm("Are you sure you want to delete this category?")) return;

        try {
            const res = await fetch(`/api/categories/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                fetchCategories();
            } else {
                alert("Failed to delete category");
            }
        } catch (error) {
            console.error("Failed to delete category", error);
        }
    };

    const handleSaveCategory = async (category: any) => {
        try {
            const url = category.id ? `/api/categories/${category.id}` : "/api/categories";
            const method = category.id ? "PATCH" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(category),
            });

            if (res.ok) {
                fetchCategories();
            } else {
                const data = await res.json();
                alert(data.error || "Failed to save category");
                throw new Error(data.error);
            }
        } catch (error) {
            console.error("Failed to save category", error);
            throw error;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
                <Button onClick={handleAddCategory}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Category
                </Button>
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <CategoryTable
                    categories={categories}
                    onEdit={handleEditCategory}
                    onDelete={handleDeleteCategory}
                />
            )}

            <CategoryDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                category={selectedCategory}
                onSave={handleSaveCategory}
            />
        </div>
    );
}
