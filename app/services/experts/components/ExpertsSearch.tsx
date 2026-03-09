import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

const filterTags = [
    "Anxiety (Lo âu)",
    "Depression (Trầm cảm)",
    "Trauma (Sang chấn)",
    "Relationships (Mối quan hệ)",
    "Stress (Căng thẳng)",
];

export function ExpertsSearch() {
    return (
        <div className="space-y-6">
            {/* Title */}
            <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
                    Tìm kiếm Chuyên gia
                </h1>
                <p className="text-slate-500 mt-1">
                    Gặp gỡ những người đồng hành tâm lý tận tâm nhất.
                </p>
            </div>

            {/* Search bar */}
            <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Tìm theo tên, học hàm hoặc chuyên môn..."
                        className="w-full h-12 pl-12 pr-4 rounded-2xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                    />
                </div>
                <Button variant="outline" className="h-12 px-5 rounded-2xl border-slate-200 text-slate-600 font-semibold gap-2">
                    <SlidersHorizontal className="w-4 h-4" />
                    Bộ lọc
                </Button>
            </div>

            {/* Filter Tags */}
            <div className="flex items-center gap-2 flex-wrap">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-primary">TẤT CẢ</span>
                </div>
                {filterTags.map((tag) => (
                    <button
                        key={tag}
                        className="px-4 py-2 rounded-full border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition font-medium"
                    >
                        {tag}
                    </button>
                ))}
            </div>
        </div>
    );
}
