import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface StatsCardProps {
    title: string
    value: string
    change?: string
    trend?: "up" | "down" | "neutral" | "active"
    icon?: LucideIcon
}

export function StatsCard({ title, value, change, trend, icon: Icon }: StatsCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                    {title}
                </CardTitle>
                {Icon && <Icon className="h-4 w-4 text-gray-400" />}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {change && (
                    <p className={cn("text-xs font-medium mt-1",
                        trend === "up" ? "text-green-500" :
                            trend === "down" ? "text-red-500" : "text-gray-500"
                    )}>
                        {change}
                    </p>
                )}
            </CardContent>
        </Card>
    )
}
