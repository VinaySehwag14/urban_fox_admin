import { StatsCard } from "@/components/dashboard/stats-card"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { OrderStatus } from "@/components/dashboard/order-status"
import { BestSellingProducts } from "@/components/dashboard/best-selling-products"
import { LowStockItems } from "@/components/dashboard/low-stock-items"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Sales"
          value="$54,293"
          change="+2.5% vs last month"
          trend="up"
        />
        <StatsCard
          title="Total Orders"
          value="1,894"
          change="+5.1% vs last month"
          trend="up"
        />
        <StatsCard
          title="New Customers"
          value="312"
          change="+1.2% vs last month"
          trend="up"
        />
        <StatsCard
          title="Avg. Order Value"
          value="$28.67"
          change="+8.3% vs last month"
          trend="up"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <RevenueChart />
        <OrderStatus />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <BestSellingProducts />
        <LowStockItems />
      </div>
    </div>
  )
}
