/**
 * Unit tests for lib/api/services/fetchThoughtRecords.ts
 *
 * Covers:
 *   - getHints: URL, data unwrapping, error propagation
 *   - listRecords: URL with and without params, empty list
 *   - createRecord: POST URL + body forwarded, data unwrapping
 *   - getRecord: URL interpolation, 404 propagation
 *   - updateRecord: PATCH URL + partial body
 *   - deleteRecord: DELETE URL, void return
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
const mockPatch = jest.fn();
const mockDelete = jest.fn();

jest.mock("@/lib/api/core", () => ({
  __esModule: true,
  default: {
    get: mockGet,
    post: mockPost,
    patch: mockPatch,
    put: jest.fn(),
    delete: mockDelete,
  },
}));

// ── SUT imports ───────────────────────────────────────────────────────────────

import { fetchThoughtRecords } from "@/lib/api/services/fetchThoughtRecords";
import type { ThoughtRecord, ThoughtRecordRequest, ThoughtRecordHint } from "@/types/thoughtRecord";

// ── Fixtures ──────────────────────────────────────────────────────────────────

const mockRecord: ThoughtRecord = {
  id: "tr_001",
  situation: "Bị chỉ trích trong cuộc họp",
  automatic_thought: "Mình thật vô dụng",
  emotion: "Xấu hổ, lo lắng",
  evidence_for: "Sếp nhìn tôi thất vọng",
  evidence_against: "Tôi đã hoàn thành 3 dự án thành công trước đó",
  created_at: "2026-06-01T10:00:00Z",
  updated_at: "2026-06-01T10:00:00Z",
};

const mockRecord2: ThoughtRecord = {
  id: "tr_002",
  situation: "Kỳ thi tiếp theo",
  automatic_thought: "Mình sẽ trượt",
  emotion: "Lo lắng",
  evidence_for: "Chưa ôn nhiều",
  evidence_against: "Đã qua được kỳ thi trước",
  created_at: "2026-06-02T08:00:00Z",
  updated_at: "2026-06-02T08:00:00Z",
};

const mockHints: ThoughtRecordHint[] = [
  { field: "situation", hint: "Mô tả tình huống xảy ra" },
  { field: "automatic_thought", hint: "Suy nghĩ đầu tiên xuất hiện" },
];

const createBody: ThoughtRecordRequest = {
  situation: "Kỳ thi tiếp theo",
  automatic_thought: "Mình sẽ trượt",
  emotion: "Lo lắng",
  evidence_for: "Chưa ôn nhiều",
  evidence_against: "Đã qua kỳ thi trước",
};

// ── Tests ──────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
});

// ─── getHints ─────────────────────────────────────────────────────────────────

describe("fetchThoughtRecords.getHints", () => {
  it("calls GET api/v1/thought-records/hints", async () => {
    mockGet.mockResolvedValueOnce({ data: mockHints });

    await fetchThoughtRecords.getHints();

    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(mockGet).toHaveBeenCalledWith("api/v1/thought-records/hints");
  });

  it("returns response.data directly", async () => {
    mockGet.mockResolvedValueOnce({ data: mockHints });

    const result = await fetchThoughtRecords.getHints();

    expect(result).toEqual(mockHints);
  });

  it("returns an empty array when server sends []", async () => {
    mockGet.mockResolvedValueOnce({ data: [] });

    const result = await fetchThoughtRecords.getHints();

    expect(result).toEqual([]);
  });

  it("propagates rejection when apiService.get throws", async () => {
    mockGet.mockRejectedValueOnce(new Error("Network error"));

    await expect(fetchThoughtRecords.getHints()).rejects.toThrow("Network error");
  });
});

// ─── listRecords ──────────────────────────────────────────────────────────────

describe("fetchThoughtRecords.listRecords", () => {
  it("calls GET api/v1/thought-records without params when none provided", async () => {
    mockGet.mockResolvedValueOnce({ data: [mockRecord, mockRecord2] });

    await fetchThoughtRecords.listRecords();

    expect(mockGet).toHaveBeenCalledWith("api/v1/thought-records", undefined);
  });

  it("forwards pagination params to apiService.get", async () => {
    mockGet.mockResolvedValueOnce({ data: [mockRecord] });

    await fetchThoughtRecords.listRecords({ limit: 10, offset: 20 });

    expect(mockGet).toHaveBeenCalledWith("api/v1/thought-records", { limit: 10, offset: 20 });
  });

  it("returns response.data directly", async () => {
    mockGet.mockResolvedValueOnce({ data: [mockRecord, mockRecord2] });

    const result = await fetchThoughtRecords.listRecords();

    expect(result).toEqual([mockRecord, mockRecord2]);
  });

  it("returns an empty array when no records exist", async () => {
    mockGet.mockResolvedValueOnce({ data: [] });

    const result = await fetchThoughtRecords.listRecords();

    expect(result).toEqual([]);
  });

  it("propagates rejection when apiService.get throws", async () => {
    mockGet.mockRejectedValueOnce(new Error("Unauthorized"));

    await expect(fetchThoughtRecords.listRecords()).rejects.toThrow("Unauthorized");
  });
});

// ─── createRecord ─────────────────────────────────────────────────────────────

describe("fetchThoughtRecords.createRecord", () => {
  it("calls POST api/v1/thought-records with the request body", async () => {
    mockPost.mockResolvedValueOnce({ data: mockRecord2 });

    await fetchThoughtRecords.createRecord(createBody);

    expect(mockPost).toHaveBeenCalledTimes(1);
    expect(mockPost).toHaveBeenCalledWith("api/v1/thought-records", createBody);
  });

  it("returns response.data directly", async () => {
    mockPost.mockResolvedValueOnce({ data: mockRecord2 });

    const result = await fetchThoughtRecords.createRecord(createBody);

    expect(result).toEqual(mockRecord2);
  });

  it("returns a record with a server-assigned id", async () => {
    mockPost.mockResolvedValueOnce({ data: { ...createBody, id: "tr_999", created_at: "2026-06-05T00:00:00Z", updated_at: "2026-06-05T00:00:00Z" } });

    const result = await fetchThoughtRecords.createRecord(createBody);

    expect(result.id).toBe("tr_999");
  });

  it("propagates rejection when apiService.post throws", async () => {
    mockPost.mockRejectedValueOnce(new Error("Validation error"));

    await expect(fetchThoughtRecords.createRecord(createBody)).rejects.toThrow("Validation error");
  });

  it("does not call get, patch, or delete", async () => {
    mockPost.mockResolvedValueOnce({ data: mockRecord2 });

    await fetchThoughtRecords.createRecord(createBody);

    expect(mockGet).not.toHaveBeenCalled();
    expect(mockPatch).not.toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();
  });
});

// ─── getRecord ────────────────────────────────────────────────────────────────

describe("fetchThoughtRecords.getRecord", () => {
  it("calls GET api/v1/thought-records/:id", async () => {
    mockGet.mockResolvedValueOnce({ data: mockRecord });

    await fetchThoughtRecords.getRecord("tr_001");

    expect(mockGet).toHaveBeenCalledWith("api/v1/thought-records/tr_001");
  });

  it("returns response.data directly", async () => {
    mockGet.mockResolvedValueOnce({ data: mockRecord });

    const result = await fetchThoughtRecords.getRecord("tr_001");

    expect(result).toEqual(mockRecord);
  });

  it("propagates a 404-shaped error for missing records", async () => {
    const err404 = { response: { status: 404 } };
    mockGet.mockRejectedValueOnce(err404);

    await expect(fetchThoughtRecords.getRecord("nonexistent")).rejects.toMatchObject({
      response: { status: 404 },
    });
  });

  it("correctly interpolates a uuid-format id into the URL", async () => {
    const uuid = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";
    mockGet.mockResolvedValueOnce({ data: { ...mockRecord, id: uuid } });

    await fetchThoughtRecords.getRecord(uuid);

    expect(mockGet).toHaveBeenCalledWith(`api/v1/thought-records/${uuid}`);
  });
});

// ─── updateRecord ─────────────────────────────────────────────────────────────

describe("fetchThoughtRecords.updateRecord", () => {
  it("calls PATCH api/v1/thought-records/:id with the partial body", async () => {
    const patch = { emotion: "Nhẹ nhõm" };
    mockPatch.mockResolvedValueOnce({ data: { ...mockRecord, emotion: "Nhẹ nhõm" } });

    await fetchThoughtRecords.updateRecord("tr_001", patch);

    expect(mockPatch).toHaveBeenCalledTimes(1);
    expect(mockPatch).toHaveBeenCalledWith("api/v1/thought-records/tr_001", patch);
  });

  it("returns the updated record from response.data", async () => {
    const updated = { ...mockRecord, emotion: "Nhẹ nhõm" };
    mockPatch.mockResolvedValueOnce({ data: updated });

    const result = await fetchThoughtRecords.updateRecord("tr_001", { emotion: "Nhẹ nhõm" });

    expect(result.emotion).toBe("Nhẹ nhõm");
  });

  it("accepts a fully populated body (all 5 fields)", async () => {
    mockPatch.mockResolvedValueOnce({ data: mockRecord });

    await fetchThoughtRecords.updateRecord("tr_001", createBody);

    expect(mockPatch).toHaveBeenCalledWith("api/v1/thought-records/tr_001", createBody);
  });

  it("propagates rejection when apiService.patch throws", async () => {
    mockPatch.mockRejectedValueOnce(new Error("Conflict"));

    await expect(fetchThoughtRecords.updateRecord("tr_001", {})).rejects.toThrow("Conflict");
  });
});

// ─── deleteRecord ─────────────────────────────────────────────────────────────

describe("fetchThoughtRecords.deleteRecord", () => {
  it("calls DELETE api/v1/thought-records/:id", async () => {
    mockDelete.mockResolvedValueOnce(undefined);

    await fetchThoughtRecords.deleteRecord("tr_001");

    expect(mockDelete).toHaveBeenCalledTimes(1);
    expect(mockDelete).toHaveBeenCalledWith("api/v1/thought-records/tr_001");
  });

  it("returns void (undefined) on success", async () => {
    mockDelete.mockResolvedValueOnce(undefined);

    const result = await fetchThoughtRecords.deleteRecord("tr_001");

    expect(result).toBeUndefined();
  });

  it("propagates rejection when apiService.delete throws", async () => {
    mockDelete.mockRejectedValueOnce(new Error("Not found"));

    await expect(fetchThoughtRecords.deleteRecord("tr_001")).rejects.toThrow("Not found");
  });

  it("does not call get, post, or patch", async () => {
    mockDelete.mockResolvedValueOnce(undefined);

    await fetchThoughtRecords.deleteRecord("tr_001");

    expect(mockGet).not.toHaveBeenCalled();
    expect(mockPost).not.toHaveBeenCalled();
    expect(mockPatch).not.toHaveBeenCalled();
  });
});
