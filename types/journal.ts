export interface JournalEntry {
  id: number;
  title: string | null;
  content: string;
  word_count: number;
  created_at: string;
  updated_at: string;
}

export interface JournalCreateRequest {
  title?: string | null;
  content?: string;
}

export interface JournalUpdateRequest {
  title?: string;
  content?: string;
}

export interface JournalListParams {
  q?: string;
  limit?: number;
  offset?: number;
}

export interface JournalPrompt {
  id: string;
  text: string;
  topic: string;
}

export interface DailyPromptResponse {
  prompt: JournalPrompt;
  topics: string[];
}
