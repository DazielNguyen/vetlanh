import { ExerciseList } from "./components/ExerciseList";
import { ProgressTracker } from "./components/ProgressTracker";

export default function ExercisesPage() {
    return (
        <div className="w-full pb-10 space-y-8">
            {/* Header */}
            <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
                <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">Bài tập chữa lành</h1>
                <p className="text-muted-foreground mt-1 text-lg">Dành ra vài phút mỗi ngày tĩnh tâm để xoa dịu tâm trí và phục hồi năng lượng.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Exercise Categories */}
                <div className="lg:col-span-2 card-lifted rounded-3xl p-6">
                    <ExerciseList />
                </div>

                {/* Right: Progress & Stats */}
                <div className="space-y-6 card-lifted rounded-3xl p-6">
                    <ProgressTracker />
                </div>
            </div>
        </div>
    );
}
