import { UploadCloud, X, Link as LinkIcon, Image as ImageIcon } from "lucide-react"
import { useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { compressImage } from "@/lib/utils"

interface SingleImageUploadProps {
    value?: string;
    onChange?: (url: string) => void;
}

export function SingleImageUpload({ value, onChange }: SingleImageUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [urlInput, setUrlInput] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const processFile = async (file: File | null) => {
        if (!file) return;
        if (!file.type.startsWith("image/")) return;

        try {
            const compressedBase64 = await compressImage(file);
            if (compressedBase64 && onChange) {
                onChange(compressedBase64);
            }
        } catch (error) {
            console.error("Failed to compress image:", error);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            processFile(e.target.files[0]);
        }
        if (e.target) {
            e.target.value = '';
        }
    };

    const openFileDialog = () => {
        fileInputRef.current?.click();
    };

    const handleAddUrl = () => {
        if (urlInput.trim() && onChange) {
            onChange(urlInput.trim());
            setUrlInput("");
        }
    };

    const handleRemoveImage = () => {
        if (onChange) {
            onChange("");
        }
    };

    return (
        <div className="space-y-4">
            {!value ? (
                <>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                                <LinkIcon className="h-4 w-4" />
                            </div>
                            <Input
                                placeholder="Paste image URL here..."
                                className="pl-9"
                                value={urlInput}
                                onChange={(e) => setUrlInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddUrl();
                                    }
                                }}
                            />
                        </div>
                        <Button type="button" variant="secondary" onClick={handleAddUrl}>
                            Add URL
                        </Button>
                    </div>

                    <div
                        className={`border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer text-center flex flex-col items-center justify-center min-h-[160px]
                            ${isDragging ? "border-[#1E88E5] bg-blue-50/50" : "border-gray-200 hover:bg-gray-50"}
                        `}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={openFileDialog}
                    >
                        <div className="flex flex-col items-center gap-2 pointer-events-none">
                            <div className={`p-3 rounded-full ${isDragging ? "bg-blue-100" : "bg-gray-100"}`}>
                                <UploadCloud className={`w-6 h-6 ${isDragging ? "text-[#1E88E5]" : "text-gray-600"}`} />
                            </div>
                            <div className="text-sm">
                                <span className="font-semibold text-[#1E88E5]">Click to upload</span>
                                <span className="text-gray-500"> or drag and drop</span>
                            </div>
                            <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileInputChange}
                        />
                    </div>
                </>
            ) : (
                <div className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">Uploaded Image</span>
                    <div className="relative group rounded-lg border bg-gray-50 overflow-hidden flex items-center justify-center h-48 w-full max-w-[200px]">
                        {value.startsWith('data:') || value.startsWith('http') ? (
                            <img
                                src={value}
                                alt="Category image"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <ImageIcon className="w-8 h-8 text-gray-400" />
                        )}

                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveImage();
                                }}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
