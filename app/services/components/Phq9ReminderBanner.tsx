import Link from "next/link";

export function Phq9ReminderBanner() {
    return (
        <div className="w-full bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex items-center justify-between gap-4 mb-6">
            <div>
                <p className="text-sm font-semibold text-amber-800">Đã đến lúc kiểm tra sức khỏe tâm lý</p>
                <p className="text-xs text-amber-600 mt-0.5">Bài đánh giá PHQ-9 giúp theo dõi trạng thái của bạn theo thời gian.</p>
            </div>
            <Link
                href="/services/assessment"
                className="shrink-0 text-xs font-semibold bg-amber-500 text-white px-4 py-2 rounded-xl hover:bg-amber-600 transition-colors"
            >
                Làm ngay
            </Link>
        </div>
    );
}
