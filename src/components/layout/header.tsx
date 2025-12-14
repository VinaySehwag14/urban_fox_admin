"use client"

import { Bell, Search, Plus, Menu } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function Header() {
    return (
        <header className="h-20 flex items-center justify-between px-8 sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 transition-all">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="lg:hidden text-slate-500">
                    <Menu className="h-6 w-6" />
                </Button>
                {/* Breadcrumb or Page title placeholder */}
                <div className="hidden md:block">
                    {/* Welcome message removed */}
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative w-72 hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Type to search..."
                        className="pl-10 h-10 bg-slate-100/50 border-slate-200 focus-visible:ring-2 focus-visible:ring-[#F59827] focus-visible:bg-white rounded-xl transition-all"
                    />
                </div>

                <div className="flex items-center gap-2 border-l border-slate-200 pl-4 ml-2">
                    <Button variant="ghost" size="icon" className="text-slate-500 hover:text-[#F59827] hover:bg-orange-50 rounded-full relative">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </Button>

                    <Button className="bg-gradient-to-r from-[#F59827] to-[#FFB65C] hover:opacity-90 text-white rounded-xl shadow-md shadow-orange-200 transition-all">
                        <Plus className="h-4 w-4 mr-2" />
                        <span>Quick Action</span>
                    </Button>
                </div>
            </div>
        </header>
    )
}
