export interface Phq9Question {
  id: number;
  text: string;
}

export interface Phq9SubmitRequest {
  answers: number[]; // 9 values, each 0–3
}

export interface Phq9Result {
  id: string;
  score: number;
  severity: "Minimal" | "Mild" | "Moderate" | "Moderately Severe" | "Severe";
  suggested_goals: string[];
  created_at: string;
}

export interface Phq9HistoryItem {
  id: string;
  score: number;
  severity: string;
  created_at: string;
}

export interface Phq9Reminder {
  due: boolean;
  days_since_last: number | null;
  next_due_at: string | null;
}
