import { UploadCloud } from "lucide-react"

export function ImageUpload() {
    return (
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 hover:bg-gray-50 transition-colors cursor-pointer text-center">
            <div className="flex flex-col items-center gap-2">
                <div className="p-3 bg-gray-100 rounded-full">
                    <UploadCloud className="w-6 h-6 text-gray-600" />
                </div>
                <div className="text-sm">
                    <span className="font-semibold text-[#1E88E5]">Upload files</span>
                    <span className="text-gray-500"> or drag and drop</span>
                </div>
                <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
            </div>
        </div>
    )
}
