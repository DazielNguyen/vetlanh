/**
 * Unit tests for:
 *   - lib/constants/packages.ts  (getPackage, PACKAGES, DEFAULT_PACKAGE_KEY)
 *   - lib/api/services/fetchSubscription.ts  (notifyPayment)
 *
 * apiService is mocked at the module level so no real network calls are made.
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

const mockUpload = jest.fn();

jest.mock("@/lib/api/core", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
    upload: mockUpload,
  },
}));

// ── SUT imports ───────────────────────────────────────────────────────────────

import { fetchSubscription, PaymentNotifyRequest, PaymentNotifyResponse } from "@/lib/api/services/fetchSubscription";
import { getPackage, PACKAGES, DEFAULT_PACKAGE_KEY } from "@/lib/constants/packages";

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeFile(name = "bill.png", type = "image/png", sizeBytes = 1024): File {
  const content = new Uint8Array(sizeBytes).fill(0);
  return new File([content], name, { type });
}

// ── Setup ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
});

// ═════════════════════════════════════════════════════════════════════════════
// getPackage
// ═════════════════════════════════════════════════════════════════════════════

describe("getPackage", () => {
  it("returns the correct package for key '1thang'", () => {
    const pkg = getPackage("1thang");
    expect(pkg.key).toBe("1thang");
    expect(pkg.amount).toBe(79000);
    expect(pkg.label).toBe("1 tháng");
  });

  it("returns the correct package for key '3thang'", () => {
    const pkg = getPackage("3thang");
    expect(pkg.key).toBe("3thang");
    expect(pkg.amount).toBe(199000);
  });

  it("returns the correct package for key '6thang'", () => {
    const pkg = getPackage("6thang");
    expect(pkg.key).toBe("6thang");
    expect(pkg.amount).toBe(349000);
  });

  it("returns the correct package for key '1nam'", () => {
    const pkg = getPackage("1nam");
    expect(pkg.key).toBe("1nam");
    expect(pkg.amount).toBe(599000);
  });

  it("returns the correct package for key 'tronddoi'", () => {
    const pkg = getPackage("tronddoi");
    expect(pkg.key).toBe("tronddoi");
    expect(pkg.amount).toBe(999000);
  });

  it("returns the default package ('1nam') for an unknown key", () => {
    const pkg = getPackage("unknown-key");
    expect(pkg.key).toBe(DEFAULT_PACKAGE_KEY);
  });

  it("returns the default package ('1nam') for empty string", () => {
    const pkg = getPackage("");
    expect(pkg.key).toBe(DEFAULT_PACKAGE_KEY);
  });

  it("returns the default package ('1nam') for null", () => {
    const pkg = getPackage(null);
    expect(pkg.key).toBe(DEFAULT_PACKAGE_KEY);
  });

  it("DEFAULT_PACKAGE_KEY is '1nam'", () => {
    expect(DEFAULT_PACKAGE_KEY).toBe("1nam");
  });

  it("package '1nam' has a badge defined", () => {
    const pkg = getPackage("1nam");
    expect(pkg.badge).toBeDefined();
    expect(pkg.badge?.text).toBe("KHUYÊN DÙNG");
  });

  it("package '1thang' has no badge", () => {
    const pkg = getPackage("1thang");
    expect(pkg.badge).toBeUndefined();
  });

  it("package '1thang' has no perMonth", () => {
    const pkg = getPackage("1thang");
    expect(pkg.perMonth).toBeUndefined();
  });

  it("package '3thang' includes a perMonth value", () => {
    const pkg = getPackage("3thang");
    expect(pkg.perMonth).toBeDefined();
    expect(typeof pkg.perMonth).toBe("string");
  });

  it("PACKAGES array contains exactly 5 entries", () => {
    expect(PACKAGES).toHaveLength(5);
  });

  it("every package in PACKAGES has a unique key", () => {
    const keys = PACKAGES.map((p) => p.key);
    const uniqueKeys = new Set(keys);
    expect(uniqueKeys.size).toBe(PACKAGES.length);
  });

  it("every package in PACKAGES has a positive amount", () => {
    PACKAGES.forEach((p) => {
      expect(p.amount).toBeGreaterThan(0);
    });
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// fetchSubscription.notifyPayment
// ═════════════════════════════════════════════════════════════════════════════

describe("fetchSubscription.notifyPayment", () => {
  const validRequest: PaymentNotifyRequest = {
    package_key: "1nam",
    amount: 599000,
    transfer_note: "VETLANH 1NAM",
  };

  const mockResponse: PaymentNotifyResponse = {
    message: "Payment notification received",
    request_id: "req_abc123",
  };

  // ── Endpoint ────────────────────────────────────────────────────────────────

  it("calls apiService.upload with the correct endpoint", async () => {
    mockUpload.mockResolvedValueOnce({ data: mockResponse });
    const file = makeFile();

    await fetchSubscription.notifyPayment(validRequest, file);

    expect(mockUpload).toHaveBeenCalledTimes(1);
    const [url] = mockUpload.mock.calls[0];
    expect(url).toBe("api/v1/subscriptions/payment-notify");
  });

  // ── FormData fields ─────────────────────────────────────────────────────────

  it("appends package_key to FormData", async () => {
    mockUpload.mockResolvedValueOnce({ data: mockResponse });
    const file = makeFile();

    await fetchSubscription.notifyPayment(validRequest, file);

    const formData: FormData = mockUpload.mock.calls[0][1];
    expect(formData.get("package_key")).toBe("1nam");
  });

  it("appends amount as a string to FormData", async () => {
    mockUpload.mockResolvedValueOnce({ data: mockResponse });
    const file = makeFile();

    await fetchSubscription.notifyPayment(validRequest, file);

    const formData: FormData = mockUpload.mock.calls[0][1];
    expect(formData.get("amount")).toBe("599000");
  });

  it("appends transfer_note to FormData", async () => {
    mockUpload.mockResolvedValueOnce({ data: mockResponse });
    const file = makeFile();

    await fetchSubscription.notifyPayment(validRequest, file);

    const formData: FormData = mockUpload.mock.calls[0][1];
    expect(formData.get("transfer_note")).toBe("VETLANH 1NAM");
  });

  it("appends bill_image file to FormData", async () => {
    mockUpload.mockResolvedValueOnce({ data: mockResponse });
    const file = makeFile("receipt.jpg", "image/jpeg");

    await fetchSubscription.notifyPayment(validRequest, file);

    const formData: FormData = mockUpload.mock.calls[0][1];
    const appended = formData.get("bill_image") as File;
    expect(appended).toBeTruthy();
    expect(appended.name).toBe("receipt.jpg");
  });

  it("sends a FormData instance as the second argument to upload", async () => {
    mockUpload.mockResolvedValueOnce({ data: mockResponse });
    const file = makeFile();

    await fetchSubscription.notifyPayment(validRequest, file);

    const formData = mockUpload.mock.calls[0][1];
    expect(formData).toBeInstanceOf(FormData);
  });

  // ── Return value ─────────────────────────────────────────────────────────────

  it("returns response.data directly (unwrapped)", async () => {
    mockUpload.mockResolvedValueOnce({ data: mockResponse });
    const file = makeFile();

    const result = await fetchSubscription.notifyPayment(validRequest, file);

    expect(result).toEqual(mockResponse);
  });

  it("returns the message from the response", async () => {
    mockUpload.mockResolvedValueOnce({ data: mockResponse });
    const file = makeFile();

    const result = await fetchSubscription.notifyPayment(validRequest, file);

    expect(result.message).toBe("Payment notification received");
  });

  it("returns the request_id from the response", async () => {
    mockUpload.mockResolvedValueOnce({ data: mockResponse });
    const file = makeFile();

    const result = await fetchSubscription.notifyPayment(validRequest, file);

    expect(result.request_id).toBe("req_abc123");
  });

  // ── Edge cases ───────────────────────────────────────────────────────────────

  it("handles a 10 MB file without error", async () => {
    mockUpload.mockResolvedValueOnce({ data: mockResponse });
    const tenMBFile = makeFile("large.png", "image/png", 10 * 1024 * 1024);

    const result = await fetchSubscription.notifyPayment(validRequest, tenMBFile);

    expect(result).toEqual(mockResponse);
    const formData: FormData = mockUpload.mock.calls[0][1];
    expect((formData.get("bill_image") as File).size).toBe(10 * 1024 * 1024);
  });

  it("handles amount = 0 (free tier edge case)", async () => {
    mockUpload.mockResolvedValueOnce({ data: mockResponse });
    const req: PaymentNotifyRequest = { ...validRequest, amount: 0 };
    const file = makeFile();

    await fetchSubscription.notifyPayment(req, file);

    const formData: FormData = mockUpload.mock.calls[0][1];
    expect(formData.get("amount")).toBe("0");
  });

  it("handles a transfer_note with Vietnamese characters", async () => {
    mockUpload.mockResolvedValueOnce({ data: mockResponse });
    const req: PaymentNotifyRequest = { ...validRequest, transfer_note: "THANHTOÁN VETLANH" };
    const file = makeFile();

    await fetchSubscription.notifyPayment(req, file);

    const formData: FormData = mockUpload.mock.calls[0][1];
    expect(formData.get("transfer_note")).toBe("THANHTOÁN VETLANH");
  });

  it("uses billImage.name as the filename in FormData", async () => {
    mockUpload.mockResolvedValueOnce({ data: mockResponse });
    const file = makeFile("my-receipt-2026.png", "image/png");

    await fetchSubscription.notifyPayment(validRequest, file);

    const formData: FormData = mockUpload.mock.calls[0][1];
    const appended = formData.get("bill_image") as File;
    expect(appended.name).toBe("my-receipt-2026.png");
  });

  // ── Error propagation ────────────────────────────────────────────────────────

  it("propagates rejection when apiService.upload throws a network error", async () => {
    mockUpload.mockRejectedValueOnce(new Error("Network error"));
    const file = makeFile();

    await expect(fetchSubscription.notifyPayment(validRequest, file)).rejects.toThrow("Network error");
  });

  it("propagates rejection for a 422 API error", async () => {
    const apiError = { code: 422, message: "Invalid package_key", status: false };
    mockUpload.mockRejectedValueOnce(apiError);
    const file = makeFile();

    await expect(fetchSubscription.notifyPayment(validRequest, file)).rejects.toMatchObject({
      code: 422,
      message: "Invalid package_key",
    });
  });

  it("propagates rejection for a 413 payload-too-large error", async () => {
    const apiError = { code: 413, message: "File too large", status: false };
    mockUpload.mockRejectedValueOnce(apiError);
    const file = makeFile();

    await expect(fetchSubscription.notifyPayment(validRequest, file)).rejects.toMatchObject({
      code: 413,
    });
  });

  it("propagates rejection for a 500 server error", async () => {
    const apiError = { code: 500, message: "Internal server error", status: false };
    mockUpload.mockRejectedValueOnce(apiError);
    const file = makeFile();

    await expect(fetchSubscription.notifyPayment(validRequest, file)).rejects.toMatchObject({
      code: 500,
    });
  });

  it("does not call upload more than once per invocation", async () => {
    mockUpload.mockResolvedValueOnce({ data: mockResponse });
    const file = makeFile();

    await fetchSubscription.notifyPayment(validRequest, file);

    expect(mockUpload).toHaveBeenCalledTimes(1);
  });
});
