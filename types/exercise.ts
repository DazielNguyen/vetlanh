export interface Exercise {
  slug: string;
  title: string;
  description: string;
  category: string;
  mood_tags: string[];
  duration_seconds?: number;
}

export interface ExerciseLog {
  id: string;
  exercise_slug: string;
  duration_seconds: number;
  completed_at: string;
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
