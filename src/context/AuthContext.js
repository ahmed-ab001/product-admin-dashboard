"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { login as loginRequest } from "@/services/authService";

// ── Storage keys ─────────────────────────────────────────────────────────────
const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

// ── Context ───────────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

// ── Helper: safe JSON parse ───────────────────────────────────────────────────
function safeParseJSON(value) {
  try {
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

// ── Provider ──────────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  // isLoading is true during the initial hydration from localStorage so
  // route guards can wait before redirecting.
  const [isLoading, setIsLoading] = useState(true);

  /* eslint-disable react-hooks/set-state-in-effect */
  // Hydrate auth state from localStorage on first mount (client only).
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = safeParseJSON(localStorage.getItem(USER_KEY));

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Listen for the auth:logout event dispatched by the Axios 401 interceptor.
  useEffect(() => {
    const handleForcedLogout = () => {
      setUser(null);
      setToken(null);
    };
    window.addEventListener("auth:logout", handleForcedLogout);
    return () => window.removeEventListener("auth:logout", handleForcedLogout);
  }, []);

  /**
   * Log in: calls the auth service, persists credentials, and updates state.
   *
   * @param {string} username
   * @param {string} password
   * @returns {Promise<void>}
   */
  const login = useCallback(async (username, password) => {
    const data = await loginRequest(username, password);
    // DummyJSON returns accessToken in the response body.
    const { accessToken, ...userInfo } = data;

    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(userInfo));

    setToken(accessToken);
    setUser(userInfo);
  }, []);

  /**
   * Log out: clears persisted credentials and resets state.
   */
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ── Hook ─────────────────────────────────────────────────────────────────────
/**
 * Consume the AuthContext. Must be used inside <AuthProvider>.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an <AuthProvider>");
  }
  return ctx;
}
