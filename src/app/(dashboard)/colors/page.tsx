"use client";

import { useState, useEffect } from "react";
import { Color } from "@/types";
import { ColorHeader } from "@/components/colors/color-header";
import { ColorTable } from "@/components/colors/color-table";
import { ColorDialog } from "@/components/colors/color-dialog";

export default function ColorsPage() {
    const [colors, setColors] = useState<Color[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedColor, setSelectedColor] = useState<Color | null>(null);

    const fetchColors = async () => {
        try {
            const res = await fetch("/api/colors");
            if (res.ok) {
                const data = await res.json();
                if (data.colors && Array.isArray(data.colors)) {
                    setColors(data.colors);
                }
            }
        } catch (error) {
            console.error("Failed to fetch colors", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchColors();
    }, []);

    const handleAddColor = () => {
        setSelectedColor(null);
        setDialogOpen(true);
    };

    const handleEditColor = (color: Color) => {
        setSelectedColor(color);
        setDialogOpen(true);
    };

    const handleDeleteColor = async (id: string) => {
        if (!confirm("Are you sure you want to delete this color?")) return;

        try {
            const res = await fetch(`/api/colors/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                fetchColors();
            } else {
                alert("Failed to delete color");
            }
        } catch (error) {
            console.error("Failed to delete color", error);
        }
    };

    const handleSaveColor = async (color: Color) => {
        try {
            const url = color.id ? `/api/colors/${color.id}` : "/api/colors";
            const method = color.id ? "PATCH" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(color),
            });

            if (res.ok) {
                fetchColors();
            } else {
                const data = await res.json();
                alert(data.error || "Failed to save color");
                throw new Error(data.error);
            }
        } catch (error) {
            console.error("Failed to save color", error);
            throw error;
        }
    };

    return (
        <div className="space-y-6">
            <ColorHeader onAdd={handleAddColor} />

            <div className="bg-white p-6 rounded-xl border shadow-sm">
                <div className="mb-4 text-sm text-gray-500">
                    Showing {colors.length} total colors
                </div>
                {loading ? (
                    <div>Loading colors...</div>
                ) : (
                    <ColorTable
                        colors={colors}
                        onEdit={handleEditColor}
                        onDelete={handleDeleteColor}
                    />
                )}
            </div>

            <ColorDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                color={selectedColor}
                onSave={handleSaveColor}
            />
        </div>
    );
}
