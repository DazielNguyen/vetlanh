"use client";

import { useState } from "react";
import CompanionCharacter, { COMPANION_STATES, type CompanionState } from "@/components/illustrations/CompanionCharacter";

export default function CompanionPreviewClient() {
  const [active, setActive] = useState<CompanionState>("idle");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-10 p-8 bg-background">
      <h1 className="text-lg font-semibold text-foreground">Companion preview (dev only)</h1>

      <CompanionCharacter state={active} className="w-48 h-48" />

      <div className="flex gap-2 flex-wrap justify-center">
        {COMPANION_STATES.map((s) => (
          <button
            key={s}
            onClick={() => setActive(s)}
            className={`px-3 py-1.5 rounded-full border text-sm transition ${
              active === s
                ? "bg-foreground text-background border-foreground"
                : "bg-background text-foreground border-border hover:bg-muted"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-6">
        {COMPANION_STATES.map((s) => (
          <div key={s} className="flex flex-col items-center gap-2">
            <CompanionCharacter state={s} className="w-16 h-16" />
            <span className="text-xs text-muted-foreground">{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
