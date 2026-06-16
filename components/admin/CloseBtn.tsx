import { X } from "lucide-react";

export function CloseBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
      <X className="w-4 h-4" />
    </button>
  );
}
