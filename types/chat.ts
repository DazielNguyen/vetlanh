export interface Conversation {
  id: string;
  title: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export interface ExerciseCard {
  slug: string;
  title: string;
  description: string;
  category: string;
  duration_seconds?: number;
}

export interface StreamChunk {
  type: "chunk" | "done" | "error";
  content?: string;
  exercise_card?: ExerciseCard;
  sentiment?: string;
  suggest_checkin?: boolean;
}
