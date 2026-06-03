/**
 * Unit tests for the authSlice reducers: logout, setToken, clearError.
 *
 * Side-effecting imports (cookies-next, apiService) are mocked so we only
 * exercise the pure Redux state transitions.
 */

// ── Mocks — must be declared before any imports ───────────────────────────────

jest.mock("redux-persist/lib/storage", () => ({
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

const mockSetCookie = jest.fn();
const mockDeleteCookie = jest.fn();

jest.mock("cookies-next", () => ({
  setCookie: (...args: unknown[]) => mockSetCookie(...args),
  deleteCookie: (...args: unknown[]) => mockDeleteCookie(...args),
  getCookie: jest.fn(),
}));

jest.mock("@/lib/api/core", () => ({
  __esModule: true,
  default: { post: jest.fn(), get: jest.fn() },
}));

jest.mock("@/lib/api/services/fetchAuth", () => ({
  __esModule: true,
  fetchAuth: { login: jest.fn() },
}));

// ── SUT imports ───────────────────────────────────────────────────────────────

import authReducer, {
  logout,
  setToken,
  clearError,
} from "@/lib/redux/slices/authSlice";
import type { User } from "@/lib/redux/slices/authSlice";

// ── Fixtures ──────────────────────────────────────────────────────────────────

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const sampleUser: User = {
  sub: "user-42",
  email: "hello@example.com",
  display_name: "Hello",
  avatar_url: null,
  timezone: "UTC",
  goals: ["coding"],
  is_verified: true,
};

const sampleToken = "sample.jwt.token";

// ── Tests ──────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
});

// ─── logout ───────────────────────────────────────────────────────────────────

describe("authSlice — logout reducer", () => {
  it("resets state to initial when called from authenticated state", () => {
    const authenticatedState = {
      user: sampleUser,
      token: sampleToken,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    };

    const nextState = authReducer(authenticatedState, logout());

    expect(nextState).toEqual(initialState);
  });

  it("resets state to initial when called from initial state (idempotent)", () => {
    const nextState = authReducer(initialState, logout());

    expect(nextState).toEqual(initialState);
  });

  it("clears a pending error", () => {
    const stateWithError = { ...initialState, error: "some error" };

    const nextState = authReducer(stateWithError, logout());

    expect(nextState.error).toBeNull();
  });

  it("calls deleteCookie('authToken') as a side effect", () => {
    authReducer(
      { ...initialState, token: sampleToken, isAuthenticated: true },
      logout()
    );

    expect(mockDeleteCookie).toHaveBeenCalledWith("authToken", { path: "/" });
  });


});

// ─── setToken ─────────────────────────────────────────────────────────────────

describe("authSlice — setToken reducer", () => {
  it("sets isAuthenticated=true, token, and user from the payload", () => {
    const nextState = authReducer(
      initialState,
      setToken({ token: sampleToken, user: sampleUser })
    );

    expect(nextState.isAuthenticated).toBe(true);
    expect(nextState.token).toBe(sampleToken);
    expect(nextState.user).toEqual(sampleUser);
  });

  it("clears any existing error", () => {
    const stateWithError = { ...initialState, error: "prior error" };

    const nextState = authReducer(
      stateWithError,
      setToken({ token: sampleToken, user: sampleUser })
    );

    expect(nextState.error).toBeNull();
  });

  it("accepts a null user (Google callback may not fully decode user yet)", () => {
    const nextState = authReducer(
      initialState,
      setToken({ token: sampleToken, user: null })
    );

    expect(nextState.isAuthenticated).toBe(true);
    expect(nextState.token).toBe(sampleToken);
    expect(nextState.user).toBeNull();
  });

  it("does not change isLoading", () => {
    const loadingState = { ...initialState, isLoading: true };

    const nextState = authReducer(
      loadingState,
      setToken({ token: sampleToken, user: sampleUser })
    );

    // setToken does not touch isLoading
    expect(nextState.isLoading).toBe(true);
  });

  it("calls setCookie with the token as a side effect", () => {
    authReducer(initialState, setToken({ token: sampleToken, user: sampleUser }));

    expect(mockSetCookie).toHaveBeenCalledWith(
      "authToken",
      sampleToken,
      expect.any(Object) // getAuthCookieConfig() result
    );
  });

  it("overwrites a previously stored token when called again", () => {
    const stateAfterFirst = authReducer(
      initialState,
      setToken({ token: "old-token", user: sampleUser })
    );
    const stateAfterSecond = authReducer(
      stateAfterFirst,
      setToken({ token: "new-token", user: sampleUser })
    );

    expect(stateAfterSecond.token).toBe("new-token");
  });
});

// ─── clearError ───────────────────────────────────────────────────────────────

describe("authSlice — clearError reducer", () => {
  it("sets error to null when there is an existing error", () => {
    const stateWithError = { ...initialState, error: "Login failed" };

    const nextState = authReducer(stateWithError, clearError());

    expect(nextState.error).toBeNull();
  });

  it("is a no-op when error is already null", () => {
    const nextState = authReducer(initialState, clearError());

    expect(nextState).toEqual(initialState);
  });
});

// ─── initial state ────────────────────────────────────────────────────────────

describe("authSlice — initial state", () => {
  it("returns the expected initial state when called with undefined", () => {
    const state = authReducer(undefined, { type: "@@INIT" });

    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });
});
