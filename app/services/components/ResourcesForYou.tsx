import { BookOpen, Headphones } from "lucide-react";

export function ResourcesForYou() {
    return (
        <div className="space-y-4 mt-8">
            <div className="flex justify-between items-end">
                <h2 className="text-xl font-bold text-primary">Tài nguyên cho bạn</h2>
                <a href="/services/exercises" className="text-xs font-bold text-slate-400 hover:text-primary transition">Xem thư viện</a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Resource 1 */}
                <div className="group cursor-pointer">
                    <div className="aspect-[4/3] rounded-3xl bg-[#FAF5EE] flex flex-col justify-end p-4 relative overflow-hidden mb-3 border border-[#F0EBE1] hover:shadow-md transition-shadow">
                        <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                            <BookOpen className="w-16 h-16 opacity-50" />
                        </div>
                        <div className="bg-white/90 backdrop-blur rounded-full px-3 py-1 w-fit text-xs font-bold text-slate-700 relative z-10 shadow-sm">
                            Đọc 5 phút
                        </div>
                    </div>
                    <h4 className="font-bold text-slate-800 group-hover:text-primary transition-colors line-clamp-2">Vượt qua Lo âu: Hướng dẫn thực hành</h4>
                </div>

                {/* Resource 2 */}
                <div className="group cursor-pointer">
                    <div className="aspect-[4/3] rounded-3xl bg-[#EEF5EF] flex flex-col justify-end p-4 relative overflow-hidden mb-3 border border-[#E1F0E3] hover:shadow-md transition-shadow">
                        <div className="absolute inset-0 flex items-center justify-center text-emerald-200">
                            <Headphones className="w-16 h-16 opacity-60" />
                        </div>
                        <div className="bg-white/90 backdrop-blur rounded-full px-3 py-1 w-fit text-xs font-bold text-slate-700 relative z-10 shadow-sm">
                            Audio 12 phút
                        </div>
                    </div>
                    <h4 className="font-bold text-slate-800 group-hover:text-primary transition-colors line-clamp-2">Thiền ngủ để nghỉ ngơi sâu</h4>
                </div>
            </div>
        </div>
    );
}
