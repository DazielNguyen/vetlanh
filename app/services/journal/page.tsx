"use client";

import { useState } from "react";
import { JournalList } from "./components/JournalList";
import { JournalEntry } from "./components/JournalEntry";
import { JournalEditor } from "./components/JournalEditor";
import { DailyPromptCard } from "./components/DailyPromptCard";
import { LevelGate } from "@/components/progression/LevelGate";

type View =
  | { mode: "idle" }
  | { mode: "view"; id: number }
  | { mode: "edit"; id: number }
  | { mode: "create"; promptText?: string };

export default function JournalPage() {
  const [view, setView] = useState<View>({ mode: "idle" });

  function handleSelectEntry(id: number) {
    setView({ mode: "view", id });
  }

  function handleEditEntry(id: number) {
    setView({ mode: "edit", id });
  }

  function handleNew(promptText?: string) {
    setView({ mode: "create", promptText });
  }

  function handleSaved() {
    setView({ mode: "idle" });
  }

  function handleDeleted() {
    setView({ mode: "idle" });
  }

  const showEditor = view.mode === "create" || view.mode === "edit";
  const showEntry = view.mode === "view";
  const showPrompt = view.mode === "idle";

  return (
    <LevelGate requiredLevel={1}>
    <div className="w-full pb-10 space-y-6">
      <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
        <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
          Nhật ký
        </h1>
        <p className="text-muted-foreground mt-1">
          Viết lại suy nghĩ, cảm xúc và khoảnh khắc trong ngày của bạn.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left: list */}
        <div className="lg:col-span-2 card-lifted rounded-3xl p-6">
          <JournalList
            selectedId={view.mode === "view" || view.mode === "edit" ? view.id : undefined}
            onSelect={handleSelectEntry}
            onNew={() => handleNew()}
          />
        </div>

        {/* Right: prompt / entry / editor */}
        <div className="lg:col-span-3 card-lifted rounded-3xl p-6">
          {showPrompt && <DailyPromptCard onUsePrompt={(text) => handleNew(text)} />}

          {showEntry && (
            <JournalEntry
              id={(view as { mode: "view"; id: number }).id}
              onEdit={handleEditEntry}
              onDeleted={handleDeleted}
            />
          )}

          {showEditor && (
            <JournalEditor
              id={view.mode === "edit" ? view.id : undefined}
              initialPromptText={view.mode === "create" ? view.promptText : undefined}
              onSaved={handleSaved}
              onCancel={() => setView({ mode: "idle" })}
            />
          )}
        </div>
      </div>
    </div>
    </LevelGate>
  );
}
