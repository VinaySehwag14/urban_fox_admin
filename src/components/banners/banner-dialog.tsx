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
import { Banner } from "@/types";

interface BannerDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    banner?: Banner | null;
    onSave: (banner: Banner) => Promise<void>;
}

export function BannerDialog({
    open,
    onOpenChange,
    banner,
    onSave,
}: BannerDialogProps) {
    const [formData, setFormData] = useState<Banner>({
        title: "",
        sub_text: "",
        image: "",
        link: "",
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (banner) {
            setFormData({
                title: banner.title,
                sub_text: banner.sub_text,
                image: banner.image,
                link: banner.link,
            });
        } else {
            setFormData({
                title: "",
                sub_text: "",
                image: "",
                link: "",
            });
        }
    }, [banner, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSave({ ...formData, id: banner?.id });
            onOpenChange(false);
        } catch (error) {
            console.error("Failed to save banner", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{banner ? "Edit Banner" : "Add Banner"}</DialogTitle>
                    <DialogDescription>
                        {banner
                            ? "Make changes to the banner here."
                            : "Add a new banner to the store."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">
                                Title
                            </Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData({ ...formData, title: e.target.value })
                                }
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="sub_text" className="text-right">
                                Sub Text
                            </Label>
                            <Input
                                id="sub_text"
                                value={formData.sub_text}
                                onChange={(e) =>
                                    setFormData({ ...formData, sub_text: e.target.value })
                                }
                                className="col-span-3"
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
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="link" className="text-right">
                                Link
                            </Label>
                            <Input
                                id="link"
                                value={formData.link}
                                onChange={(e) =>
                                    setFormData({ ...formData, link: e.target.value })
                                }
                                className="col-span-3"
                                placeholder="/products/..."
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
