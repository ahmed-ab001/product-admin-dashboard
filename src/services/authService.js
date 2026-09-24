import apiClient from "@/lib/axios";

/**
 * Log in with username + password.
 * Returns the full DummyJSON user object including the accessToken.
 *
 * @param {string} username
 * @param {string} password
 * @returns {Promise<import('@/types/auth').AuthUser>}
 */
export async function login(username, password) {
  const { data } = await apiClient.post("/auth/login", {
    username,
    password,
    expiresInMins: 60,
  });
  return data;
}

/**
 * Refresh the access token using the stored refresh token.
 * DummyJSON returns a new accessToken in the response body.
 *
 * @param {string} refreshToken
 * @returns {Promise<{ accessToken: string; refreshToken: string }>}
 */
export async function refreshToken(refreshToken) {
  const { data } = await apiClient.post("/auth/refresh", {
    refreshToken,
    expiresInMins: 60,
  });
  return data;
}

/**
 * Fetch the currently authenticated user's profile.
 * Requires a valid Bearer token to be attached (handled by the interceptor).
 *
 * @returns {Promise<import('@/types/auth').AuthUser>}
 */
export async function getMe() {
  const { data } = await apiClient.get("/auth/me");
  return data;
}
