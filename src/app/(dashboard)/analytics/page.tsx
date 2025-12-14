import { StatsCard } from "@/components/dashboard/stats-card"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { OrderStatus } from "@/components/dashboard/order-status"
import { BestSellingProducts } from "@/components/dashboard/best-selling-products"
import { LowStockItems } from "@/components/dashboard/low-stock-items"
import { cookies } from "next/headers"
import { DollarSign, ShoppingBag, Users, CreditCard } from "lucide-react"

async function getAnalyticsData() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) return { orders: [], products: [] };

  try {
    const [ordersRes, productsRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/orders/admin`, {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 0 }
      }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/products/all`, {
          headers: { Authorization: `Bearer ${token}` },
          next: { revalidate: 0 }
      })
    ]);

    const ordersData = ordersRes.ok ? await ordersRes.json() : { orders: [] };
    let products = [];
    if (productsRes.ok) {
        const pData = await productsRes.json();
        products = pData.products || (Array.isArray(pData) ? pData : []);
    }

    return {
      orders: ordersData.orders || [],
      products: products
    };
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    return { orders: [], products: [] };
  }
}

export default async function AnalyticsPage() {
  const { orders, products } = await getAnalyticsData();

  // Metrics Calculation
  const totalSales = orders
    .filter((o: any) => 
        o.payment_status?.toLowerCase() === 'paid' || 
        o.payment_status?.toLowerCase() === 'success'
    )
    .reduce((acc: number, o: any) => acc + Number(o.final_amount || o.total_amount || 0), 0);

  const totalOrdersCount = orders.length;
  const avgOrderValue = totalOrdersCount > 0 ? (totalSales / totalOrdersCount) : 0;
  const uniqueCustomers = new Set(orders.map((o: any) => o.user_id || o.user?.email || "unknown").filter((id: string) => id !== "unknown"));
  const newCustomersCount = uniqueCustomers.size;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">Analytics Overview</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Sales"
          value={`₹${totalSales.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
          change=""
          trend="up"
          icon={DollarSign}
        />
        <StatsCard
          title="Total Orders"
          value={totalOrdersCount.toString()}
          change=""
          trend="up"
          icon={ShoppingBag}
        />
        <StatsCard
          title="Unique Customers"
          value={newCustomersCount.toString()}
          change=""
          trend="up"
          icon={Users}
        />
        <StatsCard
          title="Avg. Order Value"
          value={`₹${avgOrderValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
          change=""
          trend="up"
          icon={CreditCard}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <RevenueChart orders={orders} />
        <div className="col-span-3">
          <OrderStatus orders={orders} />
        </div>
      </div>

       <div className="grid gap-4 md:grid-cols-2">
            <BestSellingProducts orders={orders} />
            <LowStockItems products={products} />
        </div>
    </div>
  )
}
