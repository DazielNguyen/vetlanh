/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setCookie, deleteCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";
import { fetchAuth } from "@/lib/api/services/fetchAuth";
import { getAuthCookieConfig } from "@/utils/cookieConfig";
import type { RootState } from "../store";

// User fields that FastAPI embeds in the JWT — exact claims depend on the BE.
// Phase 2 fetches the full profile from GET /users/me.
export interface User {
  id?: string | number;
  email?: string;
  sub?: string; // FastAPI default: subject claim (user id)
  display_name?: string | null;
  avatar_url?: string | null;
  timezone?: string | null;
  goals?: string[];
  is_verified?: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Safe JWT decode — returns null rather than throwing
export const decodeToken = (token: string): User | null => {
  try {
    return jwtDecode<User>(token);
  } catch {
    return null;
  }
};

// Async Thunks
export const loginAsync = createAsyncThunk(
  "auth/login",
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await fetchAuth.login(credentials);
      const { access_token } = response;

      const user = decodeToken(access_token);
      setCookie("authToken", access_token, getAuthCookieConfig());

      return { token: access_token, user };
    } catch (error: any) {
      return rejectWithValue(error.message || "Đăng nhập thất bại");
    }
  }
);

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Synchronous logout — BE is stateless JWT, no server call needed
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      deleteCookie("authToken", { path: "/" });
    },
    setToken: (state, action: { payload: { token: string; user: User | null } }) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.error = null;
      setCookie("authToken", action.payload.token, getAuthCookieConfig());
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, setToken, clearError } = authSlice.actions;

// Selectors
export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthToken = (state: RootState) => state.auth.token;

export default authSlice.reducer;
