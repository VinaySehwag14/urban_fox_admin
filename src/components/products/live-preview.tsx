import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface LivePreviewProps {
    data: {
        name: string
        selling_price: string
        mrp: string
        category: string
        image?: string
    }
}

export function LivePreview({ data }: LivePreviewProps) {
    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-lg">Live Preview</h3>
            <Card className="p-4 space-y-4">
                <div className="aspect-square bg-gray-200 rounded-lg relative overflow-hidden">
                    <div className="absolute top-2 right-2 flex gap-2 z-10">
                        <Badge variant="secondary" className="bg-red-100 text-red-700 hover:bg-red-100">Sale</Badge>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100">New</Badge>
                    </div>
                    {data.image ? (
                        <img
                            src={data.image}
                            alt={data.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                            <span className="text-gray-400 font-medium">No Image</span>
                        </div>
                    )}
                </div>
                <div className="space-y-1">
                    <h4 className="font-semibold text-lg text-gray-900">
                        {data.name || "Product Name"}
                    </h4>
                    <div className="flex items-center gap-2">
                        <span className="text-[#1E88E5] font-bold text-lg">
                            ₹{data.selling_price || "0.00"}
                        </span>
                        {Number(data.mrp) > Number(data.selling_price) && (
                            <span className="text-gray-400 text-sm line-through">
                                ₹{data.mrp || "0.00"}
                            </span>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    )
}
