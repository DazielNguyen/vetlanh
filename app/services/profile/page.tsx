import { ProfileCard } from "./components/ProfileCard";
import { SettingsList } from "./components/SettingsList";
import { GoalsEditor } from "./components/GoalsEditor";

export default function ProfilePage() {
    return (
        <div className="w-full pb-10 space-y-8">
            {/* Header */}
            <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
                <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">Cài đặt</h1>
                <p className="text-muted-foreground mt-1">Quản lý tài khoản và tùy chỉnh trải nghiệm của bạn.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Profile Card */}
                <ProfileCard />

                {/* Right: Settings + Goals */}
                <div className="lg:col-span-2 space-y-6">
                    <GoalsEditor />
                    <SettingsList />
                </div>
            </div>
        </div>
    );
}
