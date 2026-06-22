import { SettingsList } from "@/app/services/profile/components/SettingsList";

export default function SettingsPage() {
    return (
        <div className="w-full pb-10 space-y-8">
            <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
                <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">Cài đặt</h1>
                <p className="text-muted-foreground mt-1">Quản lý tài khoản và tùy chỉnh trải nghiệm của bạn.</p>
            </div>

            <div className="max-w-2xl mx-auto">
                <SettingsList />
            </div>
        </div>
    );
}
