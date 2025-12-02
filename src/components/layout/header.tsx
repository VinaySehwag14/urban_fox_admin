"use client"

import { Bell, Search, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function Header() {
    return (
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 sticky top-0 z-10">
            <h2 className="text-xl font-semibold text-gray-800">Dashboard Overview</h2>

            <div className="flex items-center gap-4">
                <div className="relative w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        placeholder="Search products, orders, customers"
                        className="pl-9 bg-gray-50 border-gray-200 focus-visible:ring-[#F59827]"
                    />
                </div>

                <Button className="bg-[#F59827] hover:bg-[#E08718] text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                </Button>

                <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700 relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </Button>

                <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-[#FFF4E6] text-[#F59827] text-sm font-semibold">
                            AU
                        </AvatarFallback>
                    </Avatar>
                    <div className="text-sm">
                        <p className="font-medium text-gray-900">Admin User</p>
                        <p className="text-xs text-gray-500">admin@urbanfox.com</p>
                    </div>
                </div>
            </div>
        </header>
    )
}
