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
import { Button } from "@/components/ui/button"
import { Plus, X } from "lucide-react"

interface BasicInfoStepProps {
    data: any
    updateData: (key: string, value: any) => void
    categories: { id: string; name: string }[]
}

export function BasicInfoStep({ data, updateData, categories }: BasicInfoStepProps) {
    const images = data.images || [];

    const handleAddImage = () => {
        updateData("images", [...images, ""]);
    };

    const handleRemoveImage = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        updateData("images", newImages);
    };

    const handleImageChange = (index: number, value: string) => {
        const newImages = [...images];
        newImages[index] = value;
        updateData("images", newImages);
    };

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
                    <div className="flex items-center justify-between">
                        <Label>Product Images</Label>
                        <Button type="button" variant="outline" size="sm" onClick={handleAddImage}>
                            <Plus className="w-4 h-4 mr-2" /> Add Image
                        </Button>
                    </div>

                    {images.length === 0 && (
                        <div className="text-sm text-gray-500 italic p-2 border border-dashed rounded text-center">
                            No images added. Click "Add Image" to start.
                        </div>
                    )}

                    <div className="space-y-2">
                        {images.map((url: string, index: number) => (
                            <div key={index} className="flex gap-2">
                                <Input
                                    placeholder="https://..."
                                    value={url}
                                    onChange={(e) => handleImageChange(index, e.target.value)}
                                />
                                <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveImage(index)}>
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
