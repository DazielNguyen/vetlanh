/**
 * Unit tests for decodeToken() in lib/redux/slices/authSlice.ts
 *
 * decodeToken wraps jwt-decode and returns a User object or null.
 * We test it in isolation — no Redux store, no cookies, no network.
 *
 * The module imports apiService (which reads the Redux store at module-load
 * time via cookies-next). We mock those heavy side-effecting modules so the
 * pure function can be exercised without a browser environment.
 */

// ── Mocks ─────────────────────────────────────────────────────────────────────

// redux-persist uses localStorage / sessionStorage — not available in Node
jest.mock("redux-persist/lib/storage", () => ({
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

// cookies-next uses browser globals — stub out the functions used by authSlice
jest.mock("cookies-next", () => ({
  setCookie: jest.fn(),
  deleteCookie: jest.fn(),
  getCookie: jest.fn(),
}));

// apiService singleton — prevent it from trying to contact a real server
jest.mock("@/lib/api/core", () => ({
  __esModule: true,
  default: { post: jest.fn(), get: jest.fn() },
}));

// fetchAuth — not exercised in these tests
jest.mock("@/lib/api/services/fetchAuth", () => ({
  __esModule: true,
  fetchAuth: {
    login: jest.fn(),
  },
}));

// ── Import SUT after mocks ─────────────────────────────────────────────────────
import { decodeToken } from "@/lib/redux/slices/authSlice";
import { buildJwt, futureExp } from "./helpers/jwtFixtures";

// ── Tests ──────────────────────────────────────────────────────────────────────

describe("decodeToken", () => {
  describe("happy path — valid JWT payload", () => {
    it("decodes standard User claims from a well-formed JWT", () => {
      const payload = {
        sub: "user-123",
        email: "test@example.com",
        display_name: "Test User",
        avatar_url: "https://cdn.example.com/avatar.png",
        timezone: "Asia/Ho_Chi_Minh",
        goals: ["fitness", "learning"],
        is_verified: true,
        exp: futureExp(),
      };
      const token = buildJwt(payload);

      const result = decodeToken(token);

      expect(result).not.toBeNull();
      expect(result!.sub).toBe("user-123");
      expect(result!.email).toBe("test@example.com");
      expect(result!.display_name).toBe("Test User");
      expect(result!.avatar_url).toBe("https://cdn.example.com/avatar.png");
      expect(result!.timezone).toBe("Asia/Ho_Chi_Minh");
      expect(result!.goals).toEqual(["fitness", "learning"]);
      expect(result!.is_verified).toBe(true);
    });

    it("returns only the fields present — omitted User fields are undefined", () => {
      const payload = { sub: "abc", exp: futureExp() };
      const token = buildJwt(payload);

      const result = decodeToken(token);

      expect(result).not.toBeNull();
      expect(result!.sub).toBe("abc");
      expect(result!.email).toBeUndefined();
      expect(result!.display_name).toBeUndefined();
    });

    it("handles numeric id claim", () => {
      const payload = { sub: "42", id: 42, email: "a@b.com", exp: futureExp() };
      const token = buildJwt(payload);

      const result = decodeToken(token);

      expect(result!.id).toBe(42);
    });

    it("handles null nullable fields (display_name, avatar_url, timezone)", () => {
      const payload = {
        sub: "xyz",
        display_name: null,
        avatar_url: null,
        timezone: null,
        exp: futureExp(),
      };
      const token = buildJwt(payload);

      const result = decodeToken(token);

      expect(result!.display_name).toBeNull();
      expect(result!.avatar_url).toBeNull();
      expect(result!.timezone).toBeNull();
    });

    it("handles an empty goals array", () => {
      const payload = { sub: "u1", goals: [], exp: futureExp() };
      const token = buildJwt(payload);

      const result = decodeToken(token);

      expect(result!.goals).toEqual([]);
    });
  });

  describe("error path — invalid input returns null", () => {
    it("returns null for an empty string", () => {
      expect(decodeToken("")).toBeNull();
    });

    it("returns null for a random non-JWT string", () => {
      expect(decodeToken("not-a-jwt")).toBeNull();
    });

    it("returns null for a single-segment string", () => {
      expect(decodeToken("onlyone")).toBeNull();
    });

    it("returns null when the payload segment is not valid base64", () => {
      expect(decodeToken("header.!!!invalid!!!.sig")).toBeNull();
    });

    it("returns null when the payload decodes to non-JSON", () => {
      // base64url of plain text "hello"
      const fakePayload = Buffer.from("hello").toString("base64");
      expect(decodeToken(`header.${fakePayload}.sig`)).toBeNull();
    });
  });
});
