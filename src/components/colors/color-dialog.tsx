import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Color } from "@/types";

interface ColorDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    color?: Color | null;
    onSave: (color: Color) => Promise<void>;
}

export function ColorDialog({ open, onOpenChange, color, onSave }: ColorDialogProps) {
    const [formData, setFormData] = useState<Partial<Color>>({
        name: "",
        hex_code: "#000000",
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (color) {
            setFormData({
                name: color.name,
                hex_code: color.hex_code,
            });
        } else {
            setFormData({
                name: "",
                hex_code: "#000000",
            });
        }
    }, [color, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSave({ ...formData, id: color?.id } as Color);
            onOpenChange(false);
        } catch (error) {
            console.error("Failed to save color", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{color ? "Edit Color" : "Add Color"}</DialogTitle>
                    <DialogDescription>
                        {color ? "Make changes to the color here." : "Add a new color to the store catalog."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="col-span-3"
                                placeholder="e.g. Navy Blue"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="hex_code" className="text-right">Hex Color</Label>
                            <div className="col-span-3 flex items-center gap-3">
                                <Input
                                    id="hex_code"
                                    type="color"
                                    value={formData.hex_code}
                                    onChange={(e) => setFormData({ ...formData, hex_code: e.target.value })}
                                    className="w-12 h-12 p-1 cursor-pointer"
                                    required
                                />
                                <Input
                                    type="text"
                                    value={formData.hex_code}
                                    onChange={(e) => setFormData({ ...formData, hex_code: e.target.value })}
                                    className="flex-1 uppercase"
                                    placeholder="#000000"
                                    required
                                    pattern="^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$"
                                    title="Must be a valid hex code like #1a365d"
                                />
                            </div>
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
