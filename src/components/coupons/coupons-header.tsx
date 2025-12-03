import { Button } from "@/components/ui/button"
import { Search, User, Bell } from "lucide-react"
import Link from "next/link"

export function CouponsHeader() {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Coupon List</h1>
                <p className="text-sm text-gray-500 mt-1">Manage all promotional codes and discounts for your store.</p>
            </div>
            <div className="flex items-center gap-3">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search by coupon code..."
                        className="w-64 pl-9 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59827] focus:border-transparent bg-white"
                    />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
                <Link href="/coupons/create">
                    <Button className="bg-[#1E88E5] hover:bg-[#1976D2] text-white">
                        Create Coupon
                    </Button>
                </Link>
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
