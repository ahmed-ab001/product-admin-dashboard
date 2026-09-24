import axios from "axios";

const BASE_URL = "https://dummyjson.com";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// ── Request interceptor ──────────────────────────────────────────────────────
// Automatically attaches the bearer token from localStorage when available.
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor ─────────────────────────────────────────────────────
// Centralizes error handling. On 401 the stored session is cleared so the
// AuthContext (which listens to the storage event) can update accordingly.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // If request was canceled via AbortController / CancelToken, pass through directly
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        // Clear persisted auth data and dispatch a custom event so AuthContext
        // can react without creating a circular dependency.
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("auth_user");
          window.dispatchEvent(new Event("auth:logout"));
        }
      }

      // Normalise the error message so callers always get a readable string.
      const message =
        error.response.data?.message ||
        error.response.data?.error ||
        `Request failed with status ${status}`;

      return Promise.reject(new Error(message));
    }

    if (error.request) {
      return Promise.reject(
        new Error("No response from server. Check your internet connection.")
      );
    }

    return Promise.reject(new Error(error.message || "An unexpected error occurred."));
  }
);

export default apiClient;
