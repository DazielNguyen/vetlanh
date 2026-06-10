import { MoodCheckIn } from "./components/MoodCheckIn";
import { MoodHeatmap } from "./components/MoodHeatmap";
import { MoodTrend } from "./components/MoodTrend";
import { MoodInsights } from "./components/MoodInsights";

export const metadata = {
    title: "Theo dõi tâm trạng - VẾT LÀNH",
    description: "Ghi lại và theo dõi tâm trạng hàng ngày của bạn.",
};

export default function MoodPage() {
    return (
        <div className="w-full pb-10 space-y-8">
            <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
                <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
                    Theo dõi tâm trạng
                </h1>
                <p className="text-muted-foreground mt-1">
                    Ghi lại cảm xúc mỗi ngày để hiểu rõ bản thân hơn.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: check-in + trend */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="card-lifted rounded-3xl p-6">
                        <MoodCheckIn />
                    </div>
                    <div className="card-lifted rounded-3xl p-6">
                        <MoodTrend />
                    </div>
                </div>

                {/* Right: heatmap + insights */}
                <div className="space-y-8">
                    <div className="card-lifted rounded-3xl p-6">
                        <MoodHeatmap />
                    </div>
                    <div className="card-lifted rounded-3xl p-6">
                        <MoodInsights />
                    </div>
                </div>
            </div>
        </div>
    );
}
