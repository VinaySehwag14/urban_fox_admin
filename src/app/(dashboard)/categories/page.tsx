"use client";

import { useState, useEffect } from "react";
import { CategoryHeader } from "@/components/categories/category-header";
import { CategoryFilters } from "@/components/categories/category-filters";
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
                let categoriesData = [];
                if (data.categories && Array.isArray(data.categories)) {
                    categoriesData = data.categories;
                } else if (Array.isArray(data)) {
                    categoriesData = data;
                }

                // Map backend image_url to frontend image
                const mappedCategories = categoriesData.map((cat: any) => ({
                    ...cat,
                    image: cat.image_url || cat.image || "",
                }));

                setCategories(mappedCategories);
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

            const payload = {
                ...category,
                image_url: category.image,
            };

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
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
            <CategoryHeader onAdd={handleAddCategory} />

            <div className="bg-white p-6 rounded-xl border shadow-sm">
                <CategoryFilters count={categories.length} />
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <CategoryTable
                        categories={categories}
                        onEdit={handleEditCategory}
                        onDelete={handleDeleteCategory}
                    />
                )}
            </div>

            <CategoryDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                category={selectedCategory}
                onSave={handleSaveCategory}
            />
        </div>
    );
}
