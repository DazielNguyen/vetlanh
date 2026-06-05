/**
 * Unit tests for types/chat.ts
 *
 * These are pure structural/type-level smoke tests that verify the shape of
 * fixtures expected throughout the chat feature.  No network or React involved.
 */

// No side-effecting imports in types/chat.ts so no mocks needed.

import type {
  Conversation,
  ChatMessage,
  ExerciseCard,
  StreamChunk,
} from "@/types/chat";

// ── Fixtures ──────────────────────────────────────────────────────────────────

const sampleConversation: Conversation = {
  id: "conv-1",
  title: "Hôm nay bạn cảm thấy thế nào?",
  created_at: "2026-06-05T10:00:00Z",
};

const sampleUserMessage: ChatMessage = {
  id: "msg-1",
  role: "user",
  content: "Tôi cảm thấy lo lắng",
  created_at: "2026-06-05T10:01:00Z",
};

const sampleAssistantMessage: ChatMessage = {
  id: "msg-2",
  role: "assistant",
  content: "Hãy thử bài hít thở sâu nhé.",
  created_at: "2026-06-05T10:01:05Z",
};

const sampleExerciseCard: ExerciseCard = {
  slug: "deep-breathing",
  title: "Hít thở sâu",
  description: "Bài tập hít thở giúp giảm lo âu",
  category: "breathing",
  duration_seconds: 300,
};

// ── Conversation ──────────────────────────────────────────────────────────────

describe("Conversation type shape", () => {
  it("has id, title, created_at fields", () => {
    expect(sampleConversation.id).toBe("conv-1");
    expect(sampleConversation.title).toBe("Hôm nay bạn cảm thấy thế nào?");
    expect(sampleConversation.created_at).toBe("2026-06-05T10:00:00Z");
  });

  it("id is a non-empty string", () => {
    expect(typeof sampleConversation.id).toBe("string");
    expect(sampleConversation.id.length).toBeGreaterThan(0);
  });
});

// ── ChatMessage ───────────────────────────────────────────────────────────────

describe("ChatMessage type shape", () => {
  it("user message has role 'user'", () => {
    expect(sampleUserMessage.role).toBe("user");
  });

  it("assistant message has role 'assistant'", () => {
    expect(sampleAssistantMessage.role).toBe("assistant");
  });

  it("message has id, role, content, created_at", () => {
    expect(sampleUserMessage.id).toBe("msg-1");
    expect(sampleUserMessage.content).toBe("Tôi cảm thấy lo lắng");
    expect(sampleUserMessage.created_at).toBe("2026-06-05T10:01:00Z");
  });
});

// ── ExerciseCard ──────────────────────────────────────────────────────────────

describe("ExerciseCard type shape", () => {
  it("has slug, title, description, category", () => {
    expect(sampleExerciseCard.slug).toBe("deep-breathing");
    expect(sampleExerciseCard.title).toBe("Hít thở sâu");
    expect(sampleExerciseCard.description).toBe("Bài tập hít thở giúp giảm lo âu");
    expect(sampleExerciseCard.category).toBe("breathing");
  });

  it("duration_seconds is optional — may be undefined", () => {
    const withoutDuration: ExerciseCard = {
      slug: "meditation",
      title: "Thiền định",
      description: "Giúp tâm trí thư giãn",
      category: "mindfulness",
    };
    expect(withoutDuration.duration_seconds).toBeUndefined();
  });

  it("duration_seconds is present when provided", () => {
    expect(sampleExerciseCard.duration_seconds).toBe(300);
  });
});

// ── StreamChunk ───────────────────────────────────────────────────────────────

describe("StreamChunk type shape", () => {
  it("chunk type has content", () => {
    const chunk: StreamChunk = { type: "chunk", content: "Hello " };
    expect(chunk.type).toBe("chunk");
    expect(chunk.content).toBe("Hello ");
  });

  it("done type has no content required", () => {
    const done: StreamChunk = { type: "done" };
    expect(done.type).toBe("done");
    expect(done.content).toBeUndefined();
  });

  it("error type carries an optional content message", () => {
    const error: StreamChunk = { type: "error", content: "Stream failed" };
    expect(error.type).toBe("error");
    expect(error.content).toBe("Stream failed");
  });

  it("chunk can carry exercise_card", () => {
    const chunk: StreamChunk = {
      type: "chunk",
      exercise_card: sampleExerciseCard,
    };
    expect(chunk.exercise_card?.slug).toBe("deep-breathing");
  });

  it("chunk can carry suggest_checkin flag", () => {
    const chunk: StreamChunk = { type: "chunk", suggest_checkin: true };
    expect(chunk.suggest_checkin).toBe(true);
  });

  it("chunk can carry sentiment string", () => {
    const chunk: StreamChunk = { type: "chunk", sentiment: "anxious" };
    expect(chunk.sentiment).toBe("anxious");
  });

  it("all optional fields are absent when not set", () => {
    const minimal: StreamChunk = { type: "chunk" };
    expect(minimal.content).toBeUndefined();
    expect(minimal.exercise_card).toBeUndefined();
    expect(minimal.sentiment).toBeUndefined();
    expect(minimal.suggest_checkin).toBeUndefined();
  });
});
