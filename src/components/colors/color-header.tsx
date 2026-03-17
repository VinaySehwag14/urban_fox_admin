import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ColorHeaderProps {
    onAdd: () => void;
}

export function ColorHeader({ onAdd }: ColorHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Colors</h1>
                <p className="text-gray-500">Manage the global color catalog for product variants.</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
                <Button
                    onClick={onAdd}
                    className="w-full sm:w-auto bg-[#1E88E5] hover:bg-[#1976D2] text-white"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Color
                </Button>
            </div>
        </div>
    );
}
