import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface OrdersTabsProps {
    currentTab: string
    onTabChange: (tab: string) => void
}

const tabs = ["All", "Placed", "Packed", "Shipped", "Delivered"]

export function OrdersTabs({ currentTab, onTabChange }: OrdersTabsProps) {
    return (
        <div className="flex items-center gap-2 bg-white p-1 rounded-lg w-fit border">
            {tabs.map((tab) => (
                <button
                    key={tab}
                    onClick={() => onTabChange(tab)}
                    className={cn(
                        "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
                        currentTab === tab
                            ? "bg-[#E3F2FD] text-[#1E88E5]"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                >
                    {tab}
                </button>
            ))}
        </div>
    )
}
