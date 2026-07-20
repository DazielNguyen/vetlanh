import type { CompanionState } from "@/components/illustrations/CompanionCharacter";
import type { Emotion } from "@/types/chat";

const NEGATIVE_EMOTIONS: Emotion[] = ["sad", "angry", "anxious", "disgusted"];

interface ChatCompanionInput {
  isStreaming: boolean;
  streamingText: string;
  crisisLevel: number;
  lastEmotion: { emotion: Emotion; confidence: number } | null;
}

/** Maps live chat state to a companion expression — thinking while waiting
 * on the first token, listening once text starts arriving, empathetic for
 * crisis or a negative detected emotion, happy for a positive one, idle
 * otherwise. */
export function getChatCompanionState({
  isStreaming,
  streamingText,
  crisisLevel,
  lastEmotion,
}: ChatCompanionInput): CompanionState {
  if (crisisLevel >= 3) return "empathetic";
  if (isStreaming) return streamingText ? "listening" : "thinking";
  if (lastEmotion && NEGATIVE_EMOTIONS.includes(lastEmotion.emotion)) return "empathetic";
  if (lastEmotion?.emotion === "happy") return "happy";
  return "idle";
}
