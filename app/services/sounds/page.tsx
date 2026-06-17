"use client";

import { useState, useRef, useEffect } from "react";
import {
  Play, Pause,
  Waves, CloudRain, Music2, Leaf, Volume2, Headphones, Wind, Sparkles, Loader2,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useSounds, type Sound, type SoundCategory } from "@/hooks/useSounds";

// ── Design system mapping ────────────────────────────────────────────────────

const CATEGORY_CONFIG: Record<SoundCategory, { label: string; chipBg: string; chipText: string; Icon: LucideIcon }> = {
  nature:     { label: "Thiên nhiên", chipBg: "bg-green-100/70",  chipText: "text-green-600",  Icon: Leaf },
  meditation: { label: "Thiền",       chipBg: "bg-amber-100/70",  chipText: "text-amber-600",  Icon: Sparkles },
  music:      { label: "Nhạc thiền",  chipBg: "bg-violet-100/70", chipText: "text-violet-600", Icon: Music2 },
  noise:      { label: "Tiếng ồn",    chipBg: "bg-slate-100/70",  chipText: "text-slate-500",  Icon: Volume2 },
};

const ALL_CATEGORIES = Object.keys(CATEGORY_CONFIG) as SoundCategory[];

// Icon per sound id — falls back to category icon
const SOUND_ICON: Record<string, { Icon: LucideIcon; bg: string; color: string }> = {
  stream:         { Icon: Waves,     bg: "bg-cyan-100/70",   color: "text-cyan-600" },
  "rain-light":   { Icon: CloudRain, bg: "bg-slate-100/70",  color: "text-slate-500" },
  "ocean-waves":  { Icon: Wind,      bg: "bg-sky-100/70",    color: "text-sky-600" },
  forest:         { Icon: Leaf,      bg: "bg-green-100/70",  color: "text-green-600" },
  "tibetan-bowl": { Icon: Sparkles,  bg: "bg-amber-100/70",  color: "text-amber-600" },
  "fire-crackling":{ Icon: Sparkles, bg: "bg-orange-100/70", color: "text-orange-500" },
  "healing-432hz":{ Icon: Music2,    bg: "bg-violet-100/70", color: "text-violet-600" },
  "binaural-alpha":{ Icon: Music2,   bg: "bg-indigo-100/70", color: "text-indigo-600" },
  "binaural-theta":{ Icon: Music2,   bg: "bg-purple-100/70", color: "text-purple-600" },
  "white-noise":  { Icon: Volume2,   bg: "bg-gray-100/70",   color: "text-gray-500" },
  "brown-noise":  { Icon: Volume2,   bg: "bg-stone-100/70",  color: "text-stone-500" },
  "pink-noise":   { Icon: Volume2,   bg: "bg-rose-100/70",   color: "text-rose-400" },
};

function getSoundIcon(sound: Sound) {
  return SOUND_ICON[sound.id] ?? {
    Icon: CATEGORY_CONFIG[sound.category].Icon,
    bg: CATEGORY_CONFIG[sound.category].chipBg,
    color: CATEGORY_CONFIG[sound.category].chipText,
  };
}

// Animated waveform bars shown when a sound is playing
function WaveformBars() {
  return (
    <div className="flex items-end gap-0.75 h-4" aria-hidden="true">
      {[
        { h: "h-2",   delay: "0ms" },
        { h: "h-3.5", delay: "150ms" },
        { h: "h-2.5", delay: "300ms" },
        { h: "h-3",   delay: "75ms" },
      ].map((bar, i) => (
        <div
          key={i}
          className={`w-0.5 ${bar.h} rounded-full bg-primary animate-waveform`}
          style={{ animationDelay: bar.delay }}
        />
      ))}
    </div>
  );
}

// ── Component ────────────────────────────────────────────────────────────────

export default function SoundsPage() {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<SoundCategory | undefined>();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { data: sounds, isLoading } = useSounds(activeCategory);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  function togglePlay(sound: Sound) {
    // Pause current
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    // Toggle off if same track
    if (playingId === sound.id) {
      setPlayingId(null);
      return;
    }

    const audio = new Audio(sound.audio_url);
    audio.loop = sound.duration_seconds === null;
    audio.onerror = () => {
      setPlayingId(null);
      audioRef.current = null;
      toast.error("Không thể phát âm thanh này. File có thể chưa được upload.");
    };
    audio.play().catch(() => {
      setPlayingId(null);
      audioRef.current = null;
      toast.error("Không thể phát âm thanh này. Vui lòng thử lại.");
    });
    audio.onended = () => setPlayingId(null);
    audioRef.current = audio;
    setPlayingId(sound.id);
  }

  const nowPlaying = sounds?.find((s) => s.id === playingId);

  const chipClass = (active: boolean) =>
    `flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-2xl border transition shrink-0 ${
      active
        ? "bg-primary text-white border-primary shadow-sm"
        : "bg-background/60 text-foreground/60 border-border/40 hover:border-primary/40 hover:text-foreground"
    }`;

  return (
    <div className="w-full pb-10 space-y-8">
      {/* Header */}
      <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
        <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">Âm thanh</h1>
        <p className="text-muted-foreground mt-1 text-lg">
          Tiếng thiên nhiên và âm nhạc chữa lành — bật lên và để tâm trí được nghỉ ngơi.
        </p>
      </div>

      {/* Now playing banner */}
      {nowPlaying && (
        <div className="card-lifted rounded-2xl px-5 py-3.5 flex items-center gap-4">
          {(() => {
            const { Icon, bg, color } = getSoundIcon(nowPlaying);
            return (
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
                <Icon className={`w-5 h-5 ${color}`} strokeWidth={2} />
              </div>
            );
          })()}
          <div className="flex-1 min-w-0">
            <p className="text-xs text-foreground/40 font-medium">Đang phát</p>
            <p className="text-sm font-bold text-foreground truncate">{nowPlaying.title}</p>
          </div>
          <WaveformBars />
          <button
            onClick={() => togglePlay(nowPlaying)}
            className="w-9 h-9 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition"
            aria-label="Dừng phát"
          >
            <Pause className="w-4 h-4 text-primary" strokeWidth={2.5} />
          </button>
        </div>
      )}

      {/* Filter chips */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 -mx-1 px-1">
        <button
          onClick={() => setActiveCategory(undefined)}
          className={chipClass(activeCategory === undefined)}
        >
          <Headphones className="w-3.5 h-3.5" strokeWidth={2} />
          Tất cả
        </button>
        {ALL_CATEGORIES.map((cat) => {
          const { Icon, label } = CATEGORY_CONFIG[cat];
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={chipClass(activeCategory === cat)}
            >
              <Icon className="w-3.5 h-3.5" strokeWidth={2} />
              {label}
            </button>
          );
        })}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="h-6 w-6 animate-spin text-foreground/20" strokeWidth={2} />
        </div>
      )}

      {/* Sound grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {(sounds ?? []).map((sound) => {
            const isPlaying = playingId === sound.id;
            const catCfg = CATEGORY_CONFIG[sound.category];
            const { Icon, bg, color } = getSoundIcon(sound);
            return (
              <Card
                key={sound.id}
                className={[
                  "card-lifted border-none rounded-2xl overflow-hidden transition-all duration-300",
                  isPlaying ? "ring-2 ring-primary/30 shadow-[0_0_24px_rgba(120,157,188,0.15)]" : "",
                ].join(" ")}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${bg}`}>
                      <Icon className={`w-5 h-5 ${color}`} strokeWidth={2} />
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-foreground text-sm leading-snug">{sound.title}</h3>
                        {isPlaying && <WaveformBars />}
                      </div>
                      <p className="text-xs text-foreground/50 mt-1 leading-relaxed line-clamp-2">
                        {sound.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${catCfg.chipBg} ${catCfg.chipText}`}>
                          {catCfg.label}
                        </span>
                        {sound.duration_seconds !== null && (
                          <span className="text-[11px] text-foreground/40">
                            {Math.round(sound.duration_seconds / 60)} phút
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Play / Pause — 44px Fitts's Law */}
                    <button
                      onClick={() => togglePlay(sound)}
                      aria-label={isPlaying ? `Dừng ${sound.title}` : `Phát ${sound.title}`}
                      className={[
                        "w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-all duration-200",
                        isPlaying
                          ? "bg-primary text-white shadow-md shadow-primary/30 scale-95"
                          : "bg-primary/10 text-primary hover:bg-primary hover:text-white hover:scale-95",
                      ].join(" ")}
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4" strokeWidth={2.5} />
                      ) : (
                        <Play className="w-4 h-4 translate-x-0.5" strokeWidth={2.5} />
                      )}
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && sounds?.length === 0 && (
        <p className="text-sm text-foreground/40 text-center py-12">
          Chưa có âm thanh nào trong danh mục này.
        </p>
      )}
    </div>
  );
}
