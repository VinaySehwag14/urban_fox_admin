"use client";

import { useState, useEffect } from "react";
import { BannerHeader } from "@/components/banners/banner-header";
import { BannerFilters } from "@/components/banners/banner-filters";
import { BannerTable } from "@/components/banners/banner-table";
import { BannerDialog } from "@/components/banners/banner-dialog";

interface Banner {
    id: string;
    title: string;
    sub_text: string;
    image: string;
    link: string;
}

export default function BannersPage() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);

    const fetchBanners = async () => {
        try {
            const res = await fetch("/api/banners");
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data)) {
                    setBanners(data);
                } else if (data.banners && Array.isArray(data.banners)) {
                    setBanners(data.banners);
                } else {
                    setBanners([]);
                }
            }
        } catch (error) {
            console.error("Failed to fetch banners", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    const handleAddBanner = () => {
        setSelectedBanner(null);
        setDialogOpen(true);
    };

    const handleEditBanner = (banner: Banner) => {
        setSelectedBanner(banner);
        setDialogOpen(true);
    };

    const handleDeleteBanner = async (id: string) => {
        if (!confirm("Are you sure you want to delete this banner?")) return;

        try {
            const res = await fetch(`/api/banners/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                fetchBanners();
            } else {
                alert("Failed to delete banner");
            }
        } catch (error) {
            console.error("Failed to delete banner", error);
        }
    };

    const handleSaveBanner = async (banner: any) => {
        try {
            const url = banner.id ? `/api/banners/${banner.id}` : "/api/banners";
            const method = banner.id ? "PATCH" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(banner),
            });

            if (res.ok) {
                fetchBanners();
            } else {
                const data = await res.json();
                alert(data.error || "Failed to save banner");
                throw new Error(data.error);
            }
        } catch (error) {
            console.error("Failed to save banner", error);
            throw error;
        }
    };

    return (
        <div className="space-y-6">
            <BannerHeader onAdd={handleAddBanner} />

            <div className="bg-white p-6 rounded-xl border shadow-sm">
                <BannerFilters count={banners.length} />
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <BannerTable
                        banners={banners}
                        onEdit={handleEditBanner}
                        onDelete={handleDeleteBanner}
                    />
                )}
            </div>

            <BannerDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                banner={selectedBanner}
                onSave={handleSaveBanner}
            />
        </div>
    );
}
