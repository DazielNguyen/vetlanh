export interface NotificationPreference {
  enabled: boolean;
  reminder_time: string;
  quiet_start: string;
  quiet_end: string;
  exercise_enabled: boolean;
  exercise_reminder_time: string;
}

export type NotificationPreferenceUpdate = Partial<NotificationPreference>;

export interface ExerciseReminderResponse {
  should_notify: boolean;
  reason: string; // informational only — do not display to user
}

