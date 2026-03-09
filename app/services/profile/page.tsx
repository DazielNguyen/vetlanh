import { ProfileCard } from "./components/ProfileCard";
import { SettingsList } from "./components/SettingsList";

export default function ProfilePage() {
    return (
        <div className="w-full pb-10 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">Cài đặt</h1>
                <p className="text-slate-500 mt-1">Quản lý tài khoản và tùy chỉnh trải nghiệm của bạn.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Profile Card */}
                <ProfileCard />

                {/* Right: Settings */}
                <div className="lg:col-span-2">
                    <SettingsList />
                </div>
            </div>
        </div>
    );
}
