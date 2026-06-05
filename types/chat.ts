export interface Conversation {
  id: number;
  title: string | null;
  message_count?: number;
  last_message_preview?: string | null;
  last_message_at?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface ChatMessage {
  id: number;
  role: "user" | "assistant";
  content: string;
  sentiment?: "positive" | "neutral" | "negative" | null;
  created_at: string;
}

export interface ExerciseCardStep {
  order: number;
  instruction: string;
  duration_seconds: number;
}

export interface ExerciseCard {
  id: string;
  title: string;
  description: string;
  steps: ExerciseCardStep[];
}

export interface StreamChunk {
  type: "chunk" | "done" | "error";
  // chunk: AI token stream
  content?: string;
  // done: final payload
  message_id?: number;
  exercise_card?: ExerciseCard | null;
  sentiment?: "positive" | "neutral" | "negative";
  suggest_checkin?: boolean;
  // error: reason
  detail?: string;
}
