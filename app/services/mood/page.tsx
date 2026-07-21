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
    <div className="mx-auto w-full max-w-6xl space-y-8 pb-12">
      <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
        <p className="mb-2 text-xs font-semibold tracking-[0.16em] text-primary/80">
          CHECK-IN HÔM NAY
        </p>
        <h1 className="max-w-2xl text-3xl font-semibold tracking-[-0.035em] text-foreground md:text-4xl">
          Một phút để lắng nghe mình
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
          Chọn cảm xúc gần nhất. Phần còn lại, Vết Lành sẽ giúp bạn nhìn lại nhẹ nhàng hơn.
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(19rem,0.9fr)]">
        <div className="space-y-6">
          <MoodCheckIn />
          <MoodTrend />
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24">
          <MoodInsights />
          <MoodHeatmap />
        </aside>
      </div>
    </div>
  );
}
