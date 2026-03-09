import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";

export function DailyWellnessChecklist() {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-primary">Danh sách Sức khỏe Hàng ngày</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Checked Item */}
                <Card className="border border-emerald-100 shadow-sm rounded-2xl bg-white hover:border-emerald-200 transition-colors cursor-pointer">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                            <Check className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 text-sm">Uống nước buổi sáng</h4>
                            <p className="text-xs text-slate-500">500ml nước</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Unchecked Item */}
                <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white hover:border-slate-200 transition-colors cursor-pointer">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-8 h-8 rounded-lg border-2 border-slate-200 bg-slate-50 flex items-center justify-center shrink-0">
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 text-sm">Nhật ký biết ơn</h4>
                            <p className="text-xs text-slate-500">Viết 3 điều</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
