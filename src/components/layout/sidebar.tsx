"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, ShoppingBag, ClipboardList, Users, PieChart, Image, Package, Settings, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: ShoppingBag, label: "Products", href: "/products" },
    { icon: ClipboardList, label: "Orders", href: "/orders" },
    { icon: Users, label: "Customers", href: "/customers" },
    { icon: PieChart, label: "Analytics", href: "/analytics" },
    { icon: Image, label: "Banners", href: "/banners" },
    { icon: Package, label: "Inventory", href: "/inventory" },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className="w-64 bg-white border-r h-screen fixed left-0 top-0 flex flex-col">
            <div className="p-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#F59827] to-[#E08718] rounded-lg flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">TC</span>
                </div>
                <div>
                    <h1 className="font-bold text-lg leading-none">The Clothing</h1>
                    <p className="text-xs text-gray-500">Brand</p>
                    <p className="text-xs text-gray-400">Admin Panel</p>
                </div>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-[#FFF4E6] text-[#F59827]"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t">
                <Link
                    href="/settings"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors mb-2"
                >
                    <Settings className="w-5 h-5" />
                    Settings
                </Link>
                <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors w-full">
                    <LogOut className="w-5 h-5" />
                    Logout
                </button>
            </div>
        </aside>
    )
}
