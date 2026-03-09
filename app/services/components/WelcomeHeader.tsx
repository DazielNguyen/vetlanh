export function WelcomeHeader({ name = "Minh" }: { name?: string }) {
    return (
        <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Welcome back, {name}</h1>
            <p className="text-slate-500 mt-1">Take a deep breath. You are doing great today.</p>
        </div>
    );
}
