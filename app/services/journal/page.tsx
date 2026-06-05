"use client";

import { useState } from "react";
import { JournalList } from "./components/JournalList";
import { JournalEntry } from "./components/JournalEntry";
import { JournalEditor } from "./components/JournalEditor";
import { DailyPromptCard } from "./components/DailyPromptCard";

type View =
  | { mode: "idle" }
  | { mode: "view"; id: string }
  | { mode: "edit"; id: string }
  | { mode: "create"; promptText?: string };

export default function JournalPage() {
  const [view, setView] = useState<View>({ mode: "idle" });

  function handleSelectEntry(id: string) {
    setView({ mode: "view", id });
  }

  function handleEditEntry(id: string) {
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
    <div className="w-full pb-10 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
          Nhật ký
        </h1>
        <p className="text-slate-500 mt-1">
          Viết lại suy nghĩ, cảm xúc và khoảnh khắc trong ngày của bạn.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left: list */}
        <div className="lg:col-span-2">
          <JournalList
            selectedId={view.mode === "view" || view.mode === "edit" ? view.id : undefined}
            onSelect={handleSelectEntry}
            onNew={() => handleNew()}
          />
        </div>

        {/* Right: prompt / entry / editor */}
        <div className="lg:col-span-3">
          {showPrompt && <DailyPromptCard onUsePrompt={(text) => handleNew(text)} />}

          {showEntry && (
            <JournalEntry
              id={(view as { mode: "view"; id: string }).id}
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
  );
}
