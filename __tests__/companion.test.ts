/**
 * Unit tests for lib/companion.ts
 *
 * getChatCompanionState is a pure function mapping live chat state to a
 * CompanionState — no rendering, no mocking needed.
 */

import { getChatCompanionState } from "@/lib/companion";
import type { Emotion } from "@/types/chat";

function input(overrides: Partial<Parameters<typeof getChatCompanionState>[0]> = {}) {
  return {
    isStreaming: false,
    streamingText: "",
    crisisLevel: 0,
    lastEmotion: null,
    ...overrides,
  };
}

describe("getChatCompanionState", () => {
  it("returns 'empathetic' when crisisLevel >= 3, regardless of other fields", () => {
    expect(
      getChatCompanionState(
        input({ crisisLevel: 3, isStreaming: true, streamingText: "hi", lastEmotion: { emotion: "happy", confidence: 0.9 } })
      )
    ).toBe("empathetic");
  });

  it("returns 'empathetic' for crisisLevel above 3 as well", () => {
    expect(getChatCompanionState(input({ crisisLevel: 5 }))).toBe("empathetic");
  });

  it("does not trigger crisis empathetic state below the threshold", () => {
    expect(getChatCompanionState(input({ crisisLevel: 2 }))).toBe("idle");
  });

  it("returns 'thinking' while streaming with no text yet", () => {
    expect(getChatCompanionState(input({ isStreaming: true, streamingText: "" }))).toBe("thinking");
  });

  it("returns 'listening' while streaming once text starts arriving", () => {
    expect(getChatCompanionState(input({ isStreaming: true, streamingText: "Xin chào" }))).toBe(
      "listening"
    );
  });

  it("prioritizes crisis level over streaming state", () => {
    expect(
      getChatCompanionState(input({ crisisLevel: 4, isStreaming: true, streamingText: "" }))
    ).toBe("empathetic");
  });

  it.each<Emotion>(["sad", "angry", "anxious", "disgusted"])(
    "returns 'empathetic' for negative detected emotion '%s' when not streaming",
    (emotion) => {
      expect(
        getChatCompanionState(input({ lastEmotion: { emotion, confidence: 0.8 } }))
      ).toBe("empathetic");
    }
  );

  it("returns 'happy' for a positive detected emotion", () => {
    expect(
      getChatCompanionState(input({ lastEmotion: { emotion: "happy", confidence: 0.7 } }))
    ).toBe("happy");
  });

  it("returns 'idle' for a neutral/other emotion not covered by other branches", () => {
    expect(
      getChatCompanionState(input({ lastEmotion: { emotion: "neutral", confidence: 0.5 } }))
    ).toBe("idle");
  });

  it("returns 'idle' for 'tired' emotion (not in the negative list, not happy)", () => {
    expect(
      getChatCompanionState(input({ lastEmotion: { emotion: "tired", confidence: 0.5 } }))
    ).toBe("idle");
  });

  it("returns 'idle' as the default when nothing else applies", () => {
    expect(getChatCompanionState(input())).toBe("idle");
  });

  it("prioritizes streaming state over a stale lastEmotion", () => {
    expect(
      getChatCompanionState(
        input({ isStreaming: true, streamingText: "", lastEmotion: { emotion: "happy", confidence: 0.9 } })
      )
    ).toBe("thinking");
  });
});
