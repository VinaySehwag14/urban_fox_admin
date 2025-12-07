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
import { Edit2, Trash2, ExternalLink } from "lucide-react";

interface Banner {
    id?: string;
    title: string;
    sub_text: string;
    image: string;
    link: string;
}

interface BannerTableProps {
    banners: Banner[];
    onEdit: (banner: Banner) => void;
    onDelete: (id: string) => void;
}

export function BannerTable({ banners, onEdit, onDelete }: BannerTableProps) {
    return (
        <div className="bg-white rounded-lg border shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px]">
                            <Checkbox />
                        </TableHead>
                        <TableHead>IMAGE</TableHead>
                        <TableHead>TITLE</TableHead>
                        <TableHead>SUB HEADER</TableHead>
                        <TableHead>LINK</TableHead>
                        <TableHead className="text-right">ACTIONS</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {banners.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-10">
                                No banners found
                            </TableCell>
                        </TableRow>
                    ) : (
                        banners.map((banner) => (
                            <TableRow key={banner.id}>
                                <TableCell>
                                    <Checkbox />
                                </TableCell>
                                <TableCell>
                                    <div className="h-10 w-20 overflow-hidden rounded bg-gray-100">
                                        <img
                                            src={banner.image}
                                            alt={banner.title}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium text-gray-900">
                                    {banner.title}
                                </TableCell>
                                <TableCell className="text-gray-600">
                                    {banner.sub_text}
                                </TableCell>
                                <TableCell className="text-blue-500">
                                    <div className="flex items-center gap-1">
                                        <span className="max-w-[150px] truncate block">{banner.link}</span>
                                        {banner.link && (
                                            <a href={banner.link} target="_blank" rel="noreferrer">
                                                <ExternalLink className="h-3 w-3" />
                                            </a>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-gray-500 hover:text-gray-900"
                                            onClick={() => onEdit(banner)}
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50"
                                            onClick={() => banner.id && onDelete(banner.id)}
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

            {/* Pagination (Visual only to match Products) */}
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
