export interface Phq9SubmitRequest {
  answers: number[]; // 9 values, each 0–3
}

export interface Phq9Result {
  id: number;
  score: number;
  severity: "Minimal" | "Mild" | "Moderate" | "Moderately Severe" | "Severe";
  answers: number[];
  questions: string[];
  suggested_goals: string[];
  submitted_at: string;
  score_delta: number | null;
}

export interface Phq9HistoryItem {
  id: number;
  score: number;
  severity: string;
  answers: number[];
  questions: string[];
  suggested_goals: string[];
  submitted_at: string;
  score_delta: number | null;
}

export interface Phq9Reminder {
  due: boolean;
  days_since_last: number | null;
  next_due_in_days: number;
  last_submitted_at: string | null;
}
