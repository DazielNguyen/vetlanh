import apiService from "../core";

// ====================================
// Types
// ====================================
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface UsernameRegisterRequest {
  username: string;
  password: string;
}

export interface UsernameLoginRequest {
  username: string;
  password: string;
}

// BE returns snake_case — no refresh token
export interface LoginResponse {
  access_token: string;
  token_type: "bearer";
}

export interface RegisteredUser {
  id: number;
  email: string;
  is_active: boolean;
  is_verified: boolean;
  goals: string[];
  display_name: string | null;
  avatar_url: string | null;
  timezone: string | null;
}

// ====================================
// Service
// ====================================
export const fetchAuth = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiService.post<LoginResponse>("api/v1/auth/login", data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<RegisteredUser> => {
    const response = await apiService.post<RegisteredUser>("api/v1/auth/register", data);
    return response.data;
  },

  verifyEmail: async (token: string): Promise<{ message: string }> => {
    const response = await apiService.get<{ message: string }>("api/v1/auth/verify", { token });
    return response.data;
  },

  resendVerification: async (email: string): Promise<{ message: string }> => {
    const response = await apiService.post<{ message: string }>("api/v1/auth/resend-verification", { email });
    return response.data;
  },

  registerWithUsername: async (data: UsernameRegisterRequest): Promise<LoginResponse> => {
    const response = await apiService.post<LoginResponse>("api/v1/auth/register-username", data);
    return response.data;
  },

  loginWithUsername: async (data: UsernameLoginRequest): Promise<LoginResponse> => {
    const response = await apiService.post<LoginResponse>("api/v1/auth/login-username", data);
    return response.data;
  },

  changePassword: async (data: { current_password: string; new_password: string }): Promise<{ message: string }> => {
    const response = await apiService.post<{ message: string }>("api/v1/auth/change-password", data);
    return response.data;
  },

  changeEmail: async (data: { new_email: string; current_password: string }): Promise<{ message: string }> => {
    const response = await apiService.patch<{ message: string }>("api/v1/users/me/email", data);
    return response.data;
  },

  verifyEmailChange: async (token: string): Promise<{ message: string }> => {
    const response = await apiService.get<{ message: string }>("api/v1/auth/verify-email-change", { token });
    return response.data;
  },
};
