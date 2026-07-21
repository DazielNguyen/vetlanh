"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Brain, Feather } from "lucide-react";
import { JournalList } from "./components/JournalList";
import { JournalEntry } from "./components/JournalEntry";
import { JournalEditor } from "./components/JournalEditor";
import { DailyPromptCard } from "./components/DailyPromptCard";

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
    <div className="w-full space-y-8 pb-10">
      <header className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <p className="mb-2 text-xs font-semibold tracking-[0.18em] text-primary/70 uppercase">
          Khoảng riêng của bạn
        </p>
        <h1 className="max-w-2xl font-baloo text-3xl font-bold tracking-[-0.04em] text-foreground md:text-4xl">
          Ghi chép để nhẹ lòng hơn
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
          Ghi nhanh điều đang có trong lòng, hoặc đi từng bước để nhìn một suy nghĩ rõ hơn.
        </p>
      </header>

      <section aria-label="Chọn cách ghi chép" className="grid gap-3 md:grid-cols-[1.2fr_0.8fr]">
        <button
          type="button"
          onClick={() => handleNew()}
          className="group flex min-h-32 items-center gap-4 rounded-[1.75rem] border border-hero-wordmark/10 bg-[#fff3db]/80 p-5 text-left shadow-[0_16px_40px_rgba(91,64,43,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:bg-[#ffedca] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 dark:bg-white/6 dark:hover:bg-white/9"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-illustration-coral/20 text-primary transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105">
            <Feather className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-baloo text-xl font-bold text-foreground">Ghi nhanh</span>
            <span className="mt-1 block text-sm text-muted-foreground">
              Một dòng cũng được. Không cần đúng hay hay.
            </span>
          </span>
          <ArrowRight className="h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
        </button>

        <Link
          href="/services/thought-records"
          className="group flex min-h-32 items-center gap-4 rounded-[1.75rem] border border-hero-wordmark/10 bg-illustration-mint/18 p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-hero-wordmark/20 hover:bg-illustration-mint/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 dark:bg-emerald-400/6 dark:hover:bg-emerald-400/10"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-illustration-mint/35 text-hero-wordmark dark:text-white">
            <Brain className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-baloo text-xl font-bold text-foreground">
              Gỡ rối suy nghĩ
            </span>
            <span className="mt-1 block text-sm text-muted-foreground">
              Trợ lý dẫn bạn qua 5 bước.
            </span>
          </span>
          <ArrowRight className="h-4 w-4 shrink-0 text-hero-wordmark/55 transition-transform group-hover:translate-x-1 dark:text-white/60" />
        </Link>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5 lg:gap-8">
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
  );
}
