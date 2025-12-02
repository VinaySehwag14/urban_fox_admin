import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatsCardProps {
    title: string
    value: string
    change: string
    trend: "up" | "down"
}

export function StatsCard({ title, value, change, trend }: StatsCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className={cn("text-xs font-medium mt-1",
                    trend === "up" ? "text-green-500" : "text-red-500"
                )}>
                    {change}
                </p>
            </CardContent>
        </Card>
    )
}
