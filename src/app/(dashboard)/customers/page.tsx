"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { UserTable } from "@/components/users/user-table";
import { UserDialog } from "@/components/users/user-dialog";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

export default function CustomersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/users");
            if (res.ok) {
                const data = await res.json();
                if (data.users && Array.isArray(data.users)) {
                    setUsers(data.users);
                } else if (Array.isArray(data)) {
                    // Fallback in case the API changes back or I misunderstood
                    setUsers(data);
                } else {
                    console.error("Expected array of users, got:", data);
                    setUsers([]);
                }
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAddUser = () => {
        setSelectedUser(null);
        setDialogOpen(true);
    };

    const handleEditUser = (user: User) => {
        setSelectedUser(user);
        setDialogOpen(true);
    };

    const handleDeleteUser = async (id: string) => {
        if (!confirm("Are you sure you want to delete this user?")) return;

        try {
            const res = await fetch(`/api/users/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                fetchUsers();
            } else {
                alert("Failed to delete user");
            }
        } catch (error) {
            console.error("Failed to delete user", error);
        }
    };

    const handleSaveUser = async (user: any) => {
        try {
            const url = user.id ? `/api/users/${user.id}` : "/api/users";
            const method = user.id ? "PATCH" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });

            if (res.ok) {
                fetchUsers();
            } else {
                const data = await res.json();
                alert(data.error || "Failed to save user");
                throw new Error(data.error);
            }
        } catch (error) {
            console.error("Failed to save user", error);
            throw error;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
                <Button onClick={handleAddUser}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add User
                </Button>
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <UserTable
                    users={users}
                    onEdit={handleEditUser}
                    onDelete={handleDeleteUser}
                />
            )}

            <UserDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                user={selectedUser}
                onSave={handleSaveUser}
            />
        </div>
    );
}
