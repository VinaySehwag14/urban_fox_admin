import { Button } from "@/components/ui/button"
import { Download, Search, Bell, User } from "lucide-react"

export function OrdersHeader() {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">All Orders</h1>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search by Order ID, Customer Name"
                        className="w-80 pl-9 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59827] focus:border-transparent bg-gray-50"
                    />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
            </div>
            <div className="flex items-center gap-3">
                <Button className="bg-[#1E88E5] hover:bg-[#1976D2] text-white gap-2">
                    <Download className="h-4 w-4" />
                    Export Orders
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full bg-white border">
                    <Bell className="h-4 w-4 text-gray-600" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full bg-[#FFD8A8]">
                    <User className="h-4 w-4 text-[#F59827]" />
                </Button>
            </div>
        </div>
    )
}
