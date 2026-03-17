import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { Color } from "@/types";

interface ColorTableProps {
    colors: Color[];
    onEdit: (color: Color) => void;
    onDelete: (id: string) => void;
}

export function ColorTable({ colors, onEdit, onDelete }: ColorTableProps) {
    if (colors.length === 0) {
        return <div className="p-8 text-center text-gray-500">No colors found.</div>;
    }

    return (
        <div className="border rounded-lg overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Preview</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Hex Code</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {colors.map((color) => (
                        <TableRow key={color.id}>
                            <TableCell>
                                <div
                                    className="w-8 h-8 rounded-full border border-gray-200"
                                    style={{ backgroundColor: color.hex_code }}
                                    title={color.name}
                                />
                            </TableCell>
                            <TableCell className="font-medium">{color.name}</TableCell>
                            <TableCell>
                                <code className="px-2 py-1 bg-gray-100 rounded text-sm text-gray-700">
                                    {color.hex_code}
                                </code>
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onEdit(color)}
                                        className="text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onDelete(color.id)}
                                        className="text-gray-500 hover:text-red-600 hover:bg-red-50"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
