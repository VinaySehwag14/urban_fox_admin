"use client";

import { useState, useEffect } from "react";
import { StatsCard } from "@/components/dashboard/stats-card"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { OrderStatus } from "@/components/dashboard/order-status"
import { BestSellingProducts } from "@/components/dashboard/best-selling-products"
import { LowStockItems } from "@/components/dashboard/low-stock-items"

export default function DashboardPage() {
  const [newCustomers, setNewCustomers] = useState("0");
  const [customerGrowth, setCustomerGrowth] = useState({ change: "0%", trend: "neutral" as "up" | "down" | "neutral" });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users");
        if (res.ok) {
          const data = await res.json();
          let users: any[] = [];

          if (data.users && Array.isArray(data.users)) {
            users = data.users;
          } else if (Array.isArray(data)) {
            users = data;
          }

          // Calculate counts
          const now = new Date();
          const currentMonth = now.getMonth();
          const currentYear = now.getFullYear();

          const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          const lastMonth = lastMonthDate.getMonth();
          const lastMonthYear = lastMonthDate.getFullYear();

          let currentMonthCount = 0;
          let lastMonthCount = 0;

          users.forEach(user => {
            if (user.created_at) {
              const date = new Date(user.created_at);
              if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
                currentMonthCount++;
              } else if (date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear) {
                lastMonthCount++;
              }
            }
          });

          setNewCustomers(users.length.toString());

          // Calculate percentage change
          if (lastMonthCount === 0) {
            setCustomerGrowth({
              change: currentMonthCount > 0 ? "+100% vs last month" : "0% vs last month",
              trend: currentMonthCount > 0 ? "up" : "neutral"
            });
          } else {
            const change = ((currentMonthCount - lastMonthCount) / lastMonthCount) * 100;
            setCustomerGrowth({
              change: `${change > 0 ? "+" : ""}${change.toFixed(1)}% vs last month`,
              trend: change > 0 ? "up" : change < 0 ? "down" : "neutral"
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch users for dashboard", error);
      }
    };

    fetchUsers();
  }, []);

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
          value={newCustomers}
          change={customerGrowth.change}
          trend={customerGrowth.trend as "up" | "down"}
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
