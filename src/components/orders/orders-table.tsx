import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Order } from "@/types"

const orders: Order[] = [
    {
        id: "#T-SHIRT-8912",
        customer: "Liam Johnson",
        date: "Dec 15, 2023",
        payment: "Paid",
        status: "Delivered",
        total: 29.99,
    },
    {
        id: "#HOODIE-5432",
        customer: "Olivia Smith",
        date: "Dec 14, 2023",
        payment: "Paid",
        status: "Shipped",
        total: 54.99,
    },
    {
        id: "#OVERSIZED-7854",
        customer: "Noah Williams",
        date: "Dec 14, 2023",
        payment: "Pending",
        status: "Packed",
        total: 45.00,
    },
    {
        id: "#FESTIVE-1123",
        customer: "Emma Brown",
        date: "Dec 13, 2023",
        payment: "Paid",
        status: "Placed",
        total: 49.99,
    },
    {
        id: "#SWEATSHIRT-9901",
        customer: "Ava Jones",
        date: "Dec 12, 2023",
        payment: "Paid",
        status: "Delivered",
        total: 35.00,
    },
]

export function OrdersTable() {
    return (
        <div className="bg-white rounded-lg border shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px]">
                            <Checkbox />
                        </TableHead>
                        <TableHead>ORDER ID</TableHead>
                        <TableHead>CUSTOMER</TableHead>
                        <TableHead>DATE</TableHead>
                        <TableHead>PAYMENT</TableHead>
                        <TableHead>STATUS</TableHead>
                        <TableHead className="text-right">ACTION</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.map((order) => (
                        <TableRow key={order.id}>
                            <TableCell>
                                <Checkbox />
                            </TableCell>
                            <TableCell className="font-medium text-gray-900">{order.id}</TableCell>
                            <TableCell className="text-gray-600">{order.customer}</TableCell>
                            <TableCell className="text-gray-600">{order.date}</TableCell>
                            <TableCell>
                                <Badge
                                    variant="secondary"
                                    className={
                                        order.payment === "Paid"
                                            ? "bg-green-100 text-green-700 hover:bg-green-100"
                                            : order.payment === "Pending"
                                                ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                                                : "bg-red-100 text-red-700 hover:bg-red-100"
                                    }
                                >
                                    {order.payment}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant="secondary"
                                    className={
                                        order.status === "Delivered"
                                            ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                                            : order.status === "Shipped"
                                                ? "bg-purple-100 text-purple-700 hover:bg-purple-100"
                                                : order.status === "Packed"
                                                    ? "bg-orange-100 text-orange-700 hover:bg-orange-100"
                                                    : "bg-gray-100 text-gray-700 hover:bg-gray-100"
                                    }
                                >
                                    {order.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="link" className="text-[#1E88E5] hover:text-[#1976D2] h-auto p-0">
                                    View Details
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-4 border-t">
                <span className="text-sm text-gray-500">Showing 1-5 of 100</span>
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
