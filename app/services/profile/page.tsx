import { ProfileCard } from "./components/ProfileCard";

export default function ProfilePage() {
    return (
        <div className="w-full pb-10 space-y-8">
            <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
                <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">Hồ sơ</h1>
                <p className="text-muted-foreground mt-1">Thông tin cá nhân của bạn.</p>
            </div>

            <div className="max-w-2xl mx-auto">
                <ProfileCard />
            </div>
        </div>
    );
}
