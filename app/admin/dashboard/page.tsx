export const metadata = {
    title: "Admin Dashboard - VẾT LÀNH",
    description: "Trang quản trị hệ thống Vết Lành.",
};

export default function AdminDashboardPage() {
    return (
        <div className="w-full space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Tổng quan hệ thống</h1>
                <p className="text-slate-500 mt-1">Trang dashboard dành cho quản trị viên đang được hoàn thiện.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Người dùng đang hoạt động</h3>
                    <p className="text-3xl font-extrabold text-slate-800">1,248</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Chuyên gia</h3>
                    <p className="text-3xl font-extrabold text-slate-800">45</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Lịch hẹn hôm nay</h3>
                    <p className="text-3xl font-extrabold text-slate-800">12</p>
                </div>
            </div>

            <div className="bg-white border text-center p-12 border-slate-200 rounded-2xl shadow-sm mt-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h3 className="text-lg font-medium text-slate-800">Khu vực đang được xây dựng</h3>
                <p className="text-slate-500 max-w-sm mx-auto mt-2">Tính năng quản trị chi tiết sẽ được bổ sung vào các phiên bản cập nhật tiếp theo, hiện tại đây là cấu trúc khung (Structure) cho trang Admin.</p>
            </div>
        </div>
    );
}
