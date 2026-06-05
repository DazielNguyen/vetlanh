/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { getCookie } from "cookies-next";

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
        if (error.response?.status === 401) {
          // logout() reducer handles cookie deletion
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

        const apiError: ApiError = {
          code: error.response?.status,
          message: error.response?.data?.message || error.message || "Có lỗi xảy ra",
          status: false,
          data: error.response?.data,
        };

        return Promise.reject(apiError);
      }
    );
  }

  async request<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.request<T>(config);
  }

  async get<T>(url: string, params?: Record<string, any>): Promise<AxiosResponse<T>> {
    return this.request<T>({ method: "GET", url, params });
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

const apiService = new ApiService(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/");

export default apiService;
