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
import { ImageUpload } from "../image-upload"

interface BasicInfoStepProps {
    data: any
    updateData: (key: string, value: any) => void
}

export function BasicInfoStep({ data, updateData }: BasicInfoStepProps) {
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
                                <SelectItem value="t-shirts">T-Shirts</SelectItem>
                                <SelectItem value="hoodies">Hoodies</SelectItem>
                                <SelectItem value="sweatshirts">Sweatshirts</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Sub-Category</Label>
                        <Select
                            value={data.subCategory}
                            onValueChange={(value) => updateData("subCategory", value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select sub-category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="oversized">Oversized</SelectItem>
                                <SelectItem value="regular">Regular Fit</SelectItem>
                                <SelectItem value="slim">Slim Fit</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Price</Label>
                    <Input
                        type="number"
                        placeholder="0.00"
                        value={data.price}
                        onChange={(e) => updateData("price", e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label>Product Images</Label>
                    <ImageUpload />
                </div>
            </div>
        </div>
    )
}
