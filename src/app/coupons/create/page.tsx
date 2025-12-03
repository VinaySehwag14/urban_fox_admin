import { CreateCouponForm } from "@/components/coupons/create-coupon-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CreateCouponPage() {
    return (
        <div className="space-y-6">
            {/* Breadcrumbs and Actions */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Link href="/" className="hover:text-gray-900">Dashboard</Link>
                    <span>/</span>
                    <Link href="/coupons" className="hover:text-gray-900">Coupons</Link>
                    <span>/</span>
                    <span className="text-gray-900 font-medium">Create</span>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/coupons">
                        <Button variant="outline" className="bg-white">
                            Cancel
                        </Button>
                    </Link>
                    <Button className="bg-[#1E88E5] hover:bg-[#1976D2]">
                        Save Coupon
                    </Button>
                </div>
            </div>

            {/* Page Title */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Create New Coupon</h1>
            </div>

            {/* Form */}
            <CreateCouponForm />
        </div>
    )
}
