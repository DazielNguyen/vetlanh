/**
 * Unit tests for lib/api/services/fetchPhq9.ts
 *
 * Covers:
 *   - getQuestions: correct URL, unwraps { questions: string[] } envelope,
 *     returns plain string[] (no per-question id/text object)
 *   - submitAssessment, getLatest, getHistory, getReminder: correct URL/method,
 *     data unwrapping, error propagation
 */

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock("redux-persist/lib/storage", () => ({
  default: { getItem: jest.fn(), setItem: jest.fn(), removeItem: jest.fn() },
}));

jest.mock("cookies-next", () => ({
  setCookie: jest.fn(),
  deleteCookie: jest.fn(),
  getCookie: jest.fn(() => undefined),
}));

const mockGet = jest.fn();
const mockPost = jest.fn();

jest.mock("@/lib/api/core", () => ({
  __esModule: true,
  default: { get: mockGet, post: mockPost, put: jest.fn(), patch: jest.fn() },
}));

// ── SUT imports ───────────────────────────────────────────────────────────────

import { fetchPhq9 } from "@/lib/api/services/fetchPhq9";
import type { Phq9Result, Phq9HistoryItem, Phq9Reminder } from "@/types/phq9";

// ── Fixtures ──────────────────────────────────────────────────────────────────

const mockResult: Phq9Result = {
  id: 1,
  score: 10,
  severity: "Moderate",
  answers: [1, 1, 1, 1, 1, 1, 1, 1, 2],
  questions: ["Q1", "Q2"],
  suggested_goals: ["Goal 1"],
  submitted_at: "2026-06-20T10:00:00Z",
  score_delta: null,
};

const mockHistory: Phq9HistoryItem[] = [
  { ...mockResult, id: 1 },
  { ...mockResult, id: 2, score: 8, score_delta: -2 },
];

const mockReminder: Phq9Reminder = {
  due: true,
  days_since_last: 20,
  next_due_in_days: 0,
  last_submitted_at: "2026-06-01T00:00:00Z",
};

beforeEach(() => {
  jest.clearAllMocks();
});

// ─── getQuestions ──────────────────────────────────────────────────────────────

describe("fetchPhq9.getQuestions", () => {
  it("calls GET api/v1/assessments/phq9/questions", async () => {
    mockGet.mockResolvedValueOnce({ data: { questions: ["Q1", "Q2"] } });

    await fetchPhq9.getQuestions();

    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(mockGet).toHaveBeenCalledWith("api/v1/assessments/phq9/questions");
  });

  it("unwraps the { questions: string[] } envelope and returns the inner array", async () => {
    mockGet.mockResolvedValueOnce({ data: { questions: ["Cảm thấy buồn", "Mất ngủ"] } });

    const result = await fetchPhq9.getQuestions();

    expect(result).toEqual(["Cảm thấy buồn", "Mất ngủ"]);
  });

  it("returns a plain string[], not objects with id/text", async () => {
    mockGet.mockResolvedValueOnce({ data: { questions: ["Only text, no id"] } });

    const result = await fetchPhq9.getQuestions();

    expect(typeof result[0]).toBe("string");
    expect(result[0]).not.toHaveProperty("id");
    expect(result[0]).not.toHaveProperty("text");
  });

  it("returns an empty array when questions is empty", async () => {
    mockGet.mockResolvedValueOnce({ data: { questions: [] } });

    const result = await fetchPhq9.getQuestions();

    expect(result).toEqual([]);
  });

  it("propagates rejection when apiService.get throws", async () => {
    mockGet.mockRejectedValueOnce(new Error("Network error"));

    await expect(fetchPhq9.getQuestions()).rejects.toThrow("Network error");
  });

  it("propagates a 404-shaped error so callers can branch on it", async () => {
    const err404 = { code: 404 };
    mockGet.mockRejectedValueOnce(err404);

    await expect(fetchPhq9.getQuestions()).rejects.toMatchObject({ code: 404 });
  });
});

// ─── submitAssessment ──────────────────────────────────────────────────────────

describe("fetchPhq9.submitAssessment", () => {
  it("calls POST api/v1/assessments/phq9 with the answers body", async () => {
    mockPost.mockResolvedValueOnce({ data: mockResult });

    await fetchPhq9.submitAssessment({ answers: [0, 1, 2, 3, 0, 1, 2, 3, 0] });

    expect(mockPost).toHaveBeenCalledWith("api/v1/assessments/phq9", {
      answers: [0, 1, 2, 3, 0, 1, 2, 3, 0],
    });
  });

  it("returns response.data directly", async () => {
    mockPost.mockResolvedValueOnce({ data: mockResult });

    const result = await fetchPhq9.submitAssessment({ answers: [0] });

    expect(result).toEqual(mockResult);
  });

  it("propagates rejection on server error", async () => {
    mockPost.mockRejectedValueOnce(new Error("Server error"));

    await expect(fetchPhq9.submitAssessment({ answers: [] })).rejects.toThrow("Server error");
  });
});

// ─── getLatest ──────────────────────────────────────────────────────────────────

describe("fetchPhq9.getLatest", () => {
  it("calls GET api/v1/assessments/phq9/latest", async () => {
    mockGet.mockResolvedValueOnce({ data: mockResult });

    await fetchPhq9.getLatest();

    expect(mockGet).toHaveBeenCalledWith("api/v1/assessments/phq9/latest");
  });

  it("returns response.data directly", async () => {
    mockGet.mockResolvedValueOnce({ data: mockResult });

    const result = await fetchPhq9.getLatest();

    expect(result).toEqual(mockResult);
  });

  it("propagates a 404-shaped error (no previous assessment)", async () => {
    mockGet.mockRejectedValueOnce({ code: 404 });

    await expect(fetchPhq9.getLatest()).rejects.toMatchObject({ code: 404 });
  });
});

// ─── getHistory ────────────────────────────────────────────────────────────────

describe("fetchPhq9.getHistory", () => {
  it("calls GET api/v1/assessments/phq9/history with no params by default", async () => {
    mockGet.mockResolvedValueOnce({ data: mockHistory });

    await fetchPhq9.getHistory();

    expect(mockGet).toHaveBeenCalledWith("api/v1/assessments/phq9/history", undefined);
  });

  it("forwards limit/offset params", async () => {
    mockGet.mockResolvedValueOnce({ data: mockHistory });

    await fetchPhq9.getHistory({ limit: 5, offset: 10 });

    expect(mockGet).toHaveBeenCalledWith("api/v1/assessments/phq9/history", {
      limit: 5,
      offset: 10,
    });
  });

  it("returns response.data as an array of history items", async () => {
    mockGet.mockResolvedValueOnce({ data: mockHistory });

    const result = await fetchPhq9.getHistory({ limit: 5 });

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe(1);
    expect(result[1].score_delta).toBe(-2);
  });

  it("returns an empty array when there is no history", async () => {
    mockGet.mockResolvedValueOnce({ data: [] });

    const result = await fetchPhq9.getHistory();

    expect(result).toEqual([]);
  });

  it("propagates a 404-shaped error when the endpoint is unavailable", async () => {
    mockGet.mockRejectedValueOnce({ code: 404 });

    await expect(fetchPhq9.getHistory()).rejects.toMatchObject({ code: 404 });
  });
});

// ─── getReminder ────────────────────────────────────────────────────────────────

describe("fetchPhq9.getReminder", () => {
  it("calls GET api/v1/assessments/phq9/reminder", async () => {
    mockGet.mockResolvedValueOnce({ data: mockReminder });

    await fetchPhq9.getReminder();

    expect(mockGet).toHaveBeenCalledWith("api/v1/assessments/phq9/reminder");
  });

  it("returns response.data directly", async () => {
    mockGet.mockResolvedValueOnce({ data: mockReminder });

    const result = await fetchPhq9.getReminder();

    expect(result).toEqual(mockReminder);
  });

  it("propagates a 404-shaped error when the endpoint is unavailable", async () => {
    mockGet.mockRejectedValueOnce({ code: 404 });

    await expect(fetchPhq9.getReminder()).rejects.toMatchObject({ code: 404 });
  });
});
