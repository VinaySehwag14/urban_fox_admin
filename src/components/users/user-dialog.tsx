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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface User {
    id?: string;
    name: string;
    email: string;
    role: string;
    password?: string;
}

interface UserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user?: User | null;
    onSave: (user: User) => Promise<void>;
}

export function UserDialog({
    open,
    onOpenChange,
    user,
    onSave,
}: UserDialogProps) {
    const [formData, setFormData] = useState<User>({
        name: "",
        email: "",
        role: "customer",
        password: "",
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                email: user.email,
                role: user.role,
                password: "", // Don't populate password on edit
            });
        } else {
            setFormData({
                name: "",
                email: "",
                role: "customer",
                password: "",
            });
        }
    }, [user, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSave({ ...formData, id: user?.id });
            onOpenChange(false);
        } catch (error) {
            console.error("Failed to save user", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{user ? "Edit User" : "Add User"}</DialogTitle>
                    <DialogDescription>
                        {user
                            ? "Make changes to the user profile here."
                            : "Add a new user to the system."}
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
                            <Label htmlFor="email" className="text-right">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                                className="col-span-3"
                                required
                            />
                        </div>
                        {!user && (
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="password" className="text-right">
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData({ ...formData, password: e.target.value })
                                    }
                                    className="col-span-3"
                                    required={!user}
                                />
                            </div>
                        )}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="role" className="text-right">
                                Role
                            </Label>
                            <Select
                                value={formData.role}
                                onValueChange={(value) =>
                                    setFormData({ ...formData, role: value })
                                }
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="customer">Customer</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
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
