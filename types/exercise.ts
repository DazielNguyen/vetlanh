export interface ExerciseStep {
  order: number;
  instruction: string;
  input_prompt: string | null;
  tense_seconds: number | null;   // PMR only; null for all other exercises
  release_seconds: number | null; // PMR only; null for all other exercises
}

export interface BreathingPhase {
  label: string;
  seconds: number;
}

export interface Exercise {
  slug: string;
  title: string;
  description: string;
  category: string;
  mood_tags: string[];
  duration_seconds?: number;
  duration_minutes?: number; // returned by /recommended endpoint
  steps?: ExerciseStep[];
  phases?: BreathingPhase[]; // breathing exercises only
}

export interface ExerciseLog {
  id: string;
  exercise_slug: string;
  duration_seconds: number;
  completed_at: string | null;
}

export interface ExerciseListParams {
  mood?: string;
  category?: string;
}

export interface RecommendedParams {
  mood?: string;
  limit?: number;
}

export interface LogExerciseRequest {
  exercise_slug: string;
  duration_seconds: number;
}

export interface UpdateExerciseLogFeelingRequest {
  post_session_feeling: string;
}

export interface FeelingOption {
  key: string;
  label: string;
  emoji: string;
}
