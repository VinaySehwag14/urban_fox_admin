import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface BasicInfoStepProps {
    data: any
    updateData: (key: string, value: any) => void
    categories: { id: string; name: string }[]
}

export function BasicInfoStep({ data, updateData, categories }: BasicInfoStepProps) {
    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                <p className="text-sm text-gray-500">
                    Add the product's name, description, and images.
                </p>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                        id="name"
                        placeholder="e.g., Premium Crewneck T-Shirt"
                        value={data.name}
                        onChange={(e) => updateData("name", e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        placeholder="Describe your product..."
                        className="min-h-[120px]"
                        value={data.description}
                        onChange={(e) => updateData("description", e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Category</Label>
                        <Select
                            value={data.category}
                            onValueChange={(value) => updateData("category", value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories?.map((category) => (
                                    <SelectItem key={category.id} value={category.id}>
                                        {typeof category.name === 'object' ? JSON.stringify(category.name) : category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Product Image URL</Label>
                    <Input
                        placeholder="https://..."
                        value={data.image}
                        onChange={(e) => updateData("image", e.target.value)}
                    />
                </div>
            </div>
        </div>
    )
}
