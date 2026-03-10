import { UploadCloud, X, Link as LinkIcon, Image as ImageIcon } from "lucide-react"
import { useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface ImageUploadProps {
    value?: string[];
    onChange?: (urls: string[]) => void;
}

export function ImageUpload({ value = [], onChange }: ImageUploadProps) {
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

    const processFiles = (files: FileList | null) => {
        if (!files) return;

        const newImages: string[] = [];
        let processedCount = 0;
        const totalFiles = files.length;

        Array.from(files).forEach((file) => {
            if (!file.type.startsWith("image/")) {
                processedCount++;
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                if (result) {
                    newImages.push(result);
                }
                processedCount++;
                if (processedCount === totalFiles && onChange) {
                    onChange([...value, ...newImages]);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        processFiles(e.dataTransfer.files);
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        processFiles(e.target.files);
        if (e.target) {
            e.target.value = ''; // Reset input so same file can be selected again
        }
    };

    const openFileDialog = () => {
        fileInputRef.current?.click();
    };

    const handleAddUrl = () => {
        if (urlInput.trim() && onChange) {
            onChange([...value, urlInput.trim()]);
            setUrlInput("");
        }
    };

    const handleRemoveImage = (indexToRemove: number) => {
        if (onChange) {
            onChange(value.filter((_, index) => index !== indexToRemove));
        }
    };

    return (
        <div className="space-y-4">
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
                    multiple
                    onChange={handleFileInputChange}
                />
            </div>

            {value.length > 0 && (
                <div className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">Uploaded Images ({value.length})</span>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {value.map((url, index) => (
                            <div key={index} className="relative group aspect-square rounded-lg border bg-gray-50 overflow-hidden flex items-center justify-center">
                                {url.startsWith('data:') || url.startsWith('http') ? (
                                    <img
                                        src={url}
                                        alt={`Product image ${index + 1}`}
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
                                            e.stopPropagation(); // prevent clicking the background to open file dialog if we placed this inside the dropzone
                                            handleRemoveImage(index);
                                        }}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                                {index === 0 && (
                                    <div className="absolute top-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded font-medium">
                                        Primary
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
