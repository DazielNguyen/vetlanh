export function WelcomeHeader({ greeting }: { greeting?: string }) {
    return (
        <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                {greeting ?? "Chào mừng trở lại"}
            </h1>
            <p className="text-slate-500 mt-1">Hãy hít thở thật sâu. Bạn đang làm rất tốt hôm nay.</p>
        </div>
    );
}
