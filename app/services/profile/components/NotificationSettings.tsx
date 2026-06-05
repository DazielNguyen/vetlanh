"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Loader2 } from "lucide-react";
import { useNotificationPreference, useUpdateNotificationPreference } from "@/hooks/useNotifications";
import { useCurrentUser } from "@/hooks/useUser";
import type { NotificationPreference, NotificationPreferenceUpdate } from "@/types/notifications";

const DEFAULT_PREF: NotificationPreference = {
  enabled: false,
  reminder_time: "08:00",
  quiet_start: "22:00",
  quiet_end: "07:00",
  exercise_enabled: false,
  exercise_reminder_time: "10:00",
};

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`w-11 h-6 rounded-full relative transition-colors ${
        checked ? "bg-primary" : "bg-slate-200"
      }`}
    >
      <span
        className={`w-5 h-5 rounded-full bg-white shadow-sm absolute top-0.5 transition-transform ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

export function NotificationSettings() {
  const { data: pref, isLoading } = useNotificationPreference();
  const { mutate: updatePref, isPending } = useUpdateNotificationPreference();
  const { data: user } = useCurrentUser();

  const userTimezone =
    user?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;

  const [form, setForm] = useState<NotificationPreference>(DEFAULT_PREF);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (pref) {
      setForm({
        enabled: pref.enabled,
        reminder_time: pref.reminder_time,
        quiet_start: pref.quiet_start,
        quiet_end: pref.quiet_end,
        exercise_enabled: pref.exercise_enabled,
        exercise_reminder_time: pref.exercise_reminder_time,
      });
      setDirty(false);
    }
  }, [pref]);

  function set<K extends keyof NotificationPreference>(
    key: K,
    value: NotificationPreference[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  }

  function handleSave() {
    updatePref(form, {
      onSuccess: () => setDirty(false),
    });
  }

  if (isLoading) {
    return (
      <Card className="border-none shadow-sm rounded-3xl">
        <CardContent className="flex items-center justify-center h-24">
          <Loader2 className="h-5 w-5 animate-spin text-slate-300" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-sm rounded-3xl">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <Bell className="w-4 h-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-slate-800">Cài đặt thông báo</CardTitle>
            <p className="text-xs text-slate-400 mt-0.5">Múi giờ: {userTimezone}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 pt-3">
        {/* Main notification toggle */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-800">Bật thông báo</p>
            <p className="text-xs text-slate-400">Nhận nhắc nhở theo lịch đặt</p>
          </div>
          <Toggle
            checked={form.enabled}
            onChange={(v) => set("enabled", v)}
            label="Bật thông báo"
          />
        </div>

        {form.enabled && (
          <>
            <div className="space-y-1.5">
              <label htmlFor="reminder_time" className="text-sm font-semibold text-slate-700">Giờ nhắc nhở</label>
              <p className="text-xs text-slate-400">Thời điểm gửi nhắc nhở hàng ngày</p>
              <input
                id="reminder_time"
                type="time"
                value={form.reminder_time}
                onChange={(e) => set("reminder_time", e.target.value)}
                className="px-4 py-2 rounded-2xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="quiet_start" className="text-sm font-semibold text-slate-700">Bắt đầu giờ yên tĩnh</label>
                <input
                  id="quiet_start"
                  type="time"
                  value={form.quiet_start}
                  onChange={(e) => set("quiet_start", e.target.value)}
                  className="w-full px-4 py-2 rounded-2xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="quiet_end" className="text-sm font-semibold text-slate-700">Kết thúc giờ yên tĩnh</label>
                <input
                  id="quiet_end"
                  type="time"
                  value={form.quiet_end}
                  onChange={(e) => set("quiet_end", e.target.value)}
                  className="w-full px-4 py-2 rounded-2xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                />
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-800">Nhắc nhở bài tập</p>
                  <p className="text-xs text-slate-400">Nhắc thực hiện bài tập sức khỏe tâm thần</p>
                </div>
                <Toggle
                  checked={form.exercise_enabled}
                  onChange={(v) => set("exercise_enabled", v)}
                  label="Bật nhắc nhở bài tập"
                />
              </div>

              {form.exercise_enabled && (
                <div className="space-y-1.5">
                  <label htmlFor="exercise_reminder_time" className="text-sm font-semibold text-slate-700">Giờ nhắc bài tập</label>
                  <input
                    id="exercise_reminder_time"
                    type="time"
                    value={form.exercise_reminder_time}
                    onChange={(e) => set("exercise_reminder_time", e.target.value)}
                    className="px-4 py-2 rounded-2xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  />
                </div>
              )}
            </div>
          </>
        )}

        {dirty && (
          <Button
            onClick={handleSave}
            disabled={isPending}
            className="w-full rounded-2xl font-bold h-11"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Lưu cài đặt"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
