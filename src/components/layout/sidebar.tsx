"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    ShoppingBag,
    ClipboardList,
    Users,
    PieChart,
    Image as ImageIcon,
    Package,
    Settings,
    LogOut,
    Layers,
    Tag,
    ChevronRight,
    QrCode
} from "lucide-react"
import { cn } from "@/lib/utils"

const mainNav = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: ShoppingBag, label: "Products", href: "/products" },
    { icon: ClipboardList, label: "Orders", href: "/orders" },
    { icon: Users, label: "Customers", href: "/customers" },
    { icon: Package, label: "Inventory", href: "/inventory" },
]

const marketingNav = [
    { icon: PieChart, label: "Analytics", href: "/analytics" },
    { icon: ImageIcon, label: "Banners", href: "/banners" },
    { icon: Tag, label: "Coupons", href: "/coupons" },
    { icon: Layers, label: "Categories", href: "/categories" },
]

const systemNav = [
    { icon: Settings, label: "Settings", href: "/settings" },
]

export function Sidebar() {
    const pathname = usePathname()

    const NavItem = ({ item }: { item: any }) => {
        const isActive = pathname === item.href
        return (
            <Link
                href={item.href}
                className={cn(
                    "group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive
                        ? "bg-gradient-to-r from-[#F59827] to-[#FFB65C] text-white shadow-md shadow-orange-200"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
            >
                <div className="flex items-center gap-3">
                    <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600")} />
                    <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-white/80" />}
            </Link>
        )
    }

    return (
        <aside className="w-72 bg-white/80 backdrop-blur-xl border-r border-slate-200 h-screen fixed left-0 top-0 flex flex-col z-50">
            {/* Brand Header */}
            <div className="p-6 pb-2">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#F59827] to-[#FFB65C] rounded-xl flex items-center justify-center shadow-lg shadow-orange-100">
                        <span className="text-white font-bold text-lg font-heading">UF</span>
                    </div>
                    <div>
                        <h1 className="font-bold text-lg leading-tight font-heading text-slate-900">Urban Fox</h1>
                        <p className="text-xs text-slate-500 font-medium">Admin Workspace</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-6 overflow-y-auto no-scrollbar py-2">

                <div>
                    <h3 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Overview</h3>
                    <div className="space-y-1">
                        {mainNav.map((item) => <NavItem key={item.href} item={item} />)}
                    </div>
                </div>

                <div>
                    <h3 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Marketing & Content</h3>
                    <div className="space-y-1">
                        {marketingNav.map((item) => <NavItem key={item.href} item={item} />)}
                    </div>
                </div>

                <div>
                    <h3 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">System</h3>
                    <div className="space-y-1">
                        {systemNav.map((item) => <NavItem key={item.href} item={item} />)}
                    </div>
                </div>

            </nav>

            {/* User Profile / Logout */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3 mb-3 px-2">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-orange-100 to-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 font-bold text-xs">
                        AD
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-semibold text-slate-900 truncate">Admin User</p>
                        <p className="text-xs text-slate-500 truncate">admin@urbanfox.com</p>
                    </div>
                </div>
                <button
                    onClick={async () => {
                        await fetch("/api/logout", { method: "POST" });
                        window.location.href = "/login";
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg w-full transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </button>
            </div>
        </aside>
    )
}
