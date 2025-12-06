import { CouponsHeader } from "@/components/coupons/coupons-header"
import { CouponsTable } from "@/components/coupons/coupons-table"

export default function CouponsPage() {
    return (
        <div className="space-y-6">
            <CouponsHeader />
            <CouponsTable />
        </div>
    )
}
