/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { getCookie } from "cookies-next";
import { env } from "@/lib/env";

// Lazy accessor — resolves the store only when a response interceptor fires,
// not at module-evaluation time. This breaks the circular dependency:
//   store -> authSlice -> fetchAuth -> core -> store (would deadlock on init)
// Only needed for dispatch (401 logout), not for reading state.
function getStore(): any {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require("@/lib/redux/store").store;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getLogout(): any {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require("@/lib/redux/slices/authSlice").logout;
}

export interface ApiError {
  code?: number;
  message: string;
  status: boolean;
  data?: unknown;
}

export interface RequestParams {
  [key: string]: string | number | boolean | undefined | null | string[];
}

class ApiService {
  private client: AxiosInstance;

  constructor(baseURL: string, timeout = 600000) {
    this.client = axios.create({
      baseURL,
      timeout,
      headers: { "Content-Type": "application/json" },
    });
    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        // Read from cookie — available immediately, no Redux rehydration race condition.
        const token = getCookie("authToken");
        if (typeof token === "string" && token) config.headers.Authorization = `Bearer ${token}`;
        if (config.data instanceof FormData) delete config.headers["Content-Type"];
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        const hadToken = !!error.config?.headers?.Authorization;

        if (error.response?.status === 401 && hadToken) {
          // Only treat as "session expired" when the request carried a token.
          // A 401 on an unauthenticated endpoint (e.g. /auth/login wrong credentials)
          // must NOT trigger logout — it means "bad credentials", not "expired session".
          const store = getStore();
          if (store) store.dispatch(getLogout()());

          if (typeof window !== "undefined") {
            window.dispatchEvent(new Event("logout"));
          }

          return Promise.reject({
            code: 401,
            message: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
            status: false,
          } as ApiError);
        }

        // FastAPI uses "detail" for error messages; on 422 it's an array of
        // { type, loc, msg, input } validation issues instead of a string.
        const detail = error.response?.data?.detail;
        const detailMessage = Array.isArray(detail)
          ? detail.map((d: { msg?: string }) => d?.msg).filter(Boolean).join("; ")
          : typeof detail === "string"
          ? detail
          : undefined;

        const apiError: ApiError = {
          code: error.response?.status,
          message:
            detailMessage ||
            error.response?.data?.message ||
            error.message ||
            "Có lỗi xảy ra",
          status: false,
          data: error.response?.data,
        };

        // Fire-and-forget error report — severity HIGH for 5xx, MEDIUM for other 4xx.
        // Uses native fetch (not apiService) to avoid recursive interceptor calls.
        const status = error.response?.status ?? 0;
        // Skip 401 (handled above), 403 (permission denied), and 404 (resource not found — not a system error).
        if (status >= 400 && status !== 401 && status !== 403 && status !== 404) {
          const base = env.apiUrl.replace(/\/$/, "");
          fetch(`${base}/api/v1/errors/report`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              error_type: `HTTP ${status}`,
              route: (error.config?.url ?? "unknown").slice(0, 500),
              severity: status >= 500 ? "HIGH" : "MEDIUM",
              description: (apiError.message ?? error.message ?? "").slice(0, 2000),
            }),
          }).catch(() => {});
        }

        return Promise.reject(apiError);
      }
    );
  }

  async request<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.request<T>(config);
  }

  async get<T>(url: string, params?: Record<string, any>): Promise<AxiosResponse<T>> {
    // Strip undefined and null values before sending — FastAPI rejects params with
    // null/undefined values as a 422 Unprocessable Entity.
    const cleanParams = params
      ? Object.fromEntries(Object.entries(params).filter(([, v]) => v != null)) // loose != preserves false/0/""
      : undefined;
    return this.request<T>({ method: "GET", url, params: cleanParams });
  }

  async post<T, D = any>(url: string, data?: D): Promise<AxiosResponse<T>> {
    return this.request<T>({ method: "POST", url, data });
  }

  async put<T, D = any>(url: string, data?: D): Promise<AxiosResponse<T>> {
    return this.request<T>({ method: "PUT", url, data });
  }

  async patch<T, D = any>(url: string, data?: D): Promise<AxiosResponse<T>> {
    return this.request<T>({ method: "PATCH", url, data });
  }

  async delete<T>(url: string): Promise<AxiosResponse<T>> {
    return this.request<T>({ method: "DELETE", url });
  }

  async upload<T>(
    url: string,
    formData: FormData,
    onProgress?: (progress: number) => void
  ): Promise<AxiosResponse<T>> {
    return this.request<T>({
      method: "POST",
      url,
      data: formData,
      onUploadProgress: (e) => {
        if (onProgress && e.total) {
          onProgress(Math.round((e.loaded * 100) / e.total));
        }
      },
    });
  }
}

const apiService = new ApiService(env.apiUrl);

export default apiService;
