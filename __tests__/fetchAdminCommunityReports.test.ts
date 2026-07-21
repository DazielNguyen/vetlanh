/**
 * Unit tests for the community-reports moderation methods added to
 * lib/api/services/fetchAdmin.ts in Phase 7: getCommunityReports,
 * warnCommunityReport, unmatchCommunityReport, banCommunityReport.
 *
 * Follows the apiService-mocking pattern in __tests__/fetchRecommendation.test.ts.
 * Pre-existing fetchAdmin methods (subscriptions/errors/users) are untouched
 * and out of scope for this phase.
 */

// ── Mocks — declared before imports ──────────────────────────────────────────

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
  default: { get: mockGet, post: mockPost, patch: mockPatch, delete: mockDelete },
}));

// ── SUT imports ───────────────────────────────────────────────────────────────

import { fetchAdmin } from "@/lib/api/services/fetchAdmin";
import type { CommunityReport } from "@/types/community";

// ── Fixtures ──────────────────────────────────────────────────────────────────

const openReport: CommunityReport = {
  id: "report-1",
  matchId: "match-1",
  reporterHandle: "MayXanh21",
  reportedHandle: "AnHung92",
  reason: "Lời lẽ khiếm nhã",
  reportedAt: "2026-07-21T08:00:00Z",
  slaDeadline: "2026-07-21T16:00:00Z",
  status: "open",
};

const resolvedReport: CommunityReport = { ...openReport, status: "resolved" };

beforeEach(() => {
  jest.clearAllMocks();
});

// ─── getCommunityReports ──────────────────────────────────────────────────────

describe("fetchAdmin.getCommunityReports", () => {
  it("calls GET api/v1/admin/community/reports with a status filter when given", async () => {
    mockGet.mockResolvedValueOnce({ data: [openReport] });

    await fetchAdmin.getCommunityReports("open");

    expect(mockGet).toHaveBeenCalledWith("api/v1/admin/community/reports", { status: "open" });
  });

  it("calls GET without a filter when no status is given", async () => {
    mockGet.mockResolvedValueOnce({ data: [openReport, resolvedReport] });

    await fetchAdmin.getCommunityReports();

    expect(mockGet).toHaveBeenCalledWith("api/v1/admin/community/reports", undefined);
  });

  it("returns the array of reports", async () => {
    mockGet.mockResolvedValueOnce({ data: [openReport] });

    const result = await fetchAdmin.getCommunityReports("open");

    expect(result).toEqual([openReport]);
  });

  it("never leaks a partner user id/avatar field — only handle-based fixtures round-trip", async () => {
    mockGet.mockResolvedValueOnce({ data: [openReport] });

    const result = await fetchAdmin.getCommunityReports("open");

    expect(result[0]).not.toHaveProperty("reporterId");
    expect(result[0]).not.toHaveProperty("reportedId");
    expect(result[0]).not.toHaveProperty("avatar");
    expect(result[0]).toHaveProperty("reporterHandle");
    expect(result[0]).toHaveProperty("reportedHandle");
  });
});

// ─── warnCommunityReport ──────────────────────────────────────────────────────

describe("fetchAdmin.warnCommunityReport", () => {
  it("calls POST api/v1/admin/community/reports/:id/warn", async () => {
    mockPost.mockResolvedValueOnce({ data: resolvedReport });

    await fetchAdmin.warnCommunityReport("report-1");

    expect(mockPost).toHaveBeenCalledWith("api/v1/admin/community/reports/report-1/warn");
  });

  it("returns the updated (resolved) report", async () => {
    mockPost.mockResolvedValueOnce({ data: resolvedReport });

    const result = await fetchAdmin.warnCommunityReport("report-1");

    expect(result).toEqual(resolvedReport);
  });
});

// ─── unmatchCommunityReport ───────────────────────────────────────────────────

describe("fetchAdmin.unmatchCommunityReport", () => {
  it("calls POST api/v1/admin/community/reports/:id/unmatch", async () => {
    mockPost.mockResolvedValueOnce({ data: resolvedReport });

    await fetchAdmin.unmatchCommunityReport("report-1");

    expect(mockPost).toHaveBeenCalledWith("api/v1/admin/community/reports/report-1/unmatch");
  });

  it("returns the updated (resolved) report", async () => {
    mockPost.mockResolvedValueOnce({ data: resolvedReport });

    const result = await fetchAdmin.unmatchCommunityReport("report-1");

    expect(result).toEqual(resolvedReport);
  });
});

// ─── banCommunityReport ───────────────────────────────────────────────────────

describe("fetchAdmin.banCommunityReport", () => {
  it("calls POST api/v1/admin/community/reports/:id/ban", async () => {
    mockPost.mockResolvedValueOnce({ data: resolvedReport });

    await fetchAdmin.banCommunityReport("report-1");

    expect(mockPost).toHaveBeenCalledWith("api/v1/admin/community/reports/report-1/ban");
  });

  it("returns the updated (resolved) report", async () => {
    mockPost.mockResolvedValueOnce({ data: resolvedReport });

    const result = await fetchAdmin.banCommunityReport("report-1");

    expect(result).toEqual(resolvedReport);
  });

  it("propagates rejection when apiService.post throws", async () => {
    mockPost.mockRejectedValueOnce(new Error("Network error"));

    await expect(fetchAdmin.banCommunityReport("report-1")).rejects.toThrow("Network error");
  });
});
