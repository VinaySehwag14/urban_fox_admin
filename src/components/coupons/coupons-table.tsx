import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit2, Trash2, Copy } from "lucide-react"
import { Coupon } from "@/types"

const coupons: Coupon[] = [
    {
        id: "1",
        code: "SUMMER20",
        discount: "20% Off",
        limit: "500 uses",
        expiryDate: "31 Dec 2024",
        assignedTo: "T-Shirts",
        status: "Active",
    },
    {
        id: "2",
        code: "WINTER50",
        discount: "$50 Off",
        limit: "100 uses",
        expiryDate: "23 Feb 2025",
        assignedTo: "Sweatshirts",
        status: "Active",
    },
    {
        id: "3",
        code: "FESTIVE",
        discount: "15% Off",
        limit: "Unlimited",
        expiryDate: "16 Jan 2024",
        assignedTo: "All Products",
        status: "Inactive",
    },
    {
        id: "4",
        code: "OVERSIZED30",
        discount: "30% Off",
        limit: "Limited ",
        expiryDate: "N/A",
        assignedTo: "Oversized",
        status: "Active",
    },
    {
        id: "5",
        code: "NEWUSER",
        discount: "$25 Off",
        limit: "1 per user",
        expiryDate: "N/A",
        assignedTo: "All Products",
        status: "Active",
    },
]

export function CouponsTable() {
    return (
        <div className="bg-white rounded-lg border shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>COUPON CODE</TableHead>
                        <TableHead>DISCOUNT</TableHead>
                        <TableHead>LIMIT</TableHead>
                        <TableHead>EXPIRY DATE</TableHead>
                        <TableHead>ASSIGNED TO</TableHead>
                        <TableHead>STATUS</TableHead>
                        <TableHead className="text-right">ACTIONS</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {coupons.map((coupon) => (
                        <TableRow key={coupon.id}>
                            <TableCell className="font-medium text-gray-900">{coupon.code}</TableCell>
                            <TableCell className="text-gray-600">{coupon.discount}</TableCell>
                            <TableCell className="text-gray-600">{coupon.limit}</TableCell>
                            <TableCell className="text-gray-600">{coupon.expiryDate}</TableCell>
                            <TableCell className="text-gray-600">{coupon.assignedTo}</TableCell>
                            <TableCell>
                                <Badge
                                    variant="secondary"
                                    className={
                                        coupon.status === "Active"
                                            ? "bg-green-100 text-green-700 hover:bg-green-100"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-100"
                                    }
                                >
                                    {coupon.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-900">
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-900">
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-4 border-t">
                <span className="text-sm text-gray-500">Showing 1-5 of 12 coupons</span>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled>
                        &lt;
                    </Button>
                    <Button variant="default" size="sm" className="h-8 w-8 p-0 bg-[#1E88E5] hover:bg-[#1976D2]">
                        1
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        2
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        3
                    </Button>
                    <span className="text-gray-400">...</span>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        10
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        &gt;
                    </Button>
                </div>
            </div>
        </div>
    )
}
