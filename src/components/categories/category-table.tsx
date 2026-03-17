"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Edit2, Trash2 } from "lucide-react";

interface Category {
    id: string;
    name: string;
    image: string;
    is_active: boolean;
}

interface CategoryTableProps {
    categories: Category[];
    onEdit: (category: Category) => void;
    onDelete: (id: string) => void;
    onToggleVisibility: (id: string, is_active: boolean) => void;
}

export function CategoryTable({ categories, onEdit, onDelete, onToggleVisibility }: CategoryTableProps) {
    return (
        <div className="bg-white rounded-lg border shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px]">
                            <Checkbox />
                        </TableHead>
                        <TableHead>IMAGE</TableHead>
                        <TableHead>NAME</TableHead>
                        <TableHead className="text-center">VISIBILITY</TableHead>
                        <TableHead className="text-right">ACTIONS</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {categories.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-10">
                                No categories found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        categories.map((category) => (
                            <TableRow
                                key={category.id}
                                className={category.is_active === false ? "opacity-50" : ""}
                            >
                                <TableCell>
                                    <Checkbox />
                                </TableCell>
                                <TableCell>
                                    <div className="h-10 w-10 overflow-hidden rounded-md bg-gray-100">
                                        <img
                                            src={category.image}
                                            alt={category.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-gray-900">{category.name}</span>
                                        {category.is_active === false && (
                                            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Hidden</span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="flex items-center justify-center">
                                        <Switch
                                            checked={category.is_active !== false}
                                            onCheckedChange={(checked) => onToggleVisibility(category.id, checked)}
                                        />
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-gray-500 hover:text-gray-900"
                                            onClick={() => onEdit(category)}
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50"
                                            onClick={() => onDelete(category.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            {/* Pagination (Visual only) */}
            <div className="flex items-center justify-center py-4 border-t">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled>
                        &lt;
                    </Button>
                    <Button variant="default" size="sm" className="h-8 w-8 p-0 bg-[#1E88E5] hover:bg-[#1976D2]">
                        1
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled>
                        &gt;
                    </Button>
                </div>
            </div>
        </div>
    );
}
