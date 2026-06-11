import { cn } from "@/lib/utils";

export function AuthCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn(
      "backdrop-blur-xl bg-white/10 border border-white/20 rounded-[28px] shadow-[0_8px_40px_rgba(0,0,0,0.3)] px-8 py-10",
      className
    )}>
      {children}
    </div>
  );
}

export function AuthIconCircle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn(
      "w-16 h-16 rounded-full bg-white/15 border border-white/25 flex items-center justify-center",
      className
    )}>
      {children}
    </div>
  );
}
