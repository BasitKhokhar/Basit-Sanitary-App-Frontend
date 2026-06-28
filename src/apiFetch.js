import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";

const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

// --- Helper functions ---
// NOTE: never log token values — that leaks credentials. Only log non-sensitive
// diagnostics, and only in development.
const log = (...args) => { if (__DEV__) console.log(...args); };

const getToken = async (key) => SecureStore.getItemAsync(key);

const setToken = async (key, value) => SecureStore.setItemAsync(key, value);

const removeTokens = async () => {
  await SecureStore.deleteItemAsync("accessToken");
  await SecureStore.deleteItemAsync("refreshToken");
};

// Single-flight refresh: when many requests hit 401 at once (e.g. the home
// screen fires 8 calls in parallel), they all await the SAME refresh promise
// instead of each firing its own /auth/refresh. Returns the new access token,
// or null if the refresh failed (caller should log out).
let refreshPromise = null;

const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) return null;
  if (refreshPromise) return refreshPromise;

  log("⚠️ Access token expired, trying refresh…");
  refreshPromise = (async () => {
    try {
      const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      if (!refreshRes.ok) return null;
      const data = await refreshRes.json();
      const newAccessToken = data.accessToken;
      if (newAccessToken) await setToken("accessToken", newAccessToken);
      return newAccessToken || null;
    } catch {
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

// --- API fetch wrapper with auto-refresh ---
export const apiFetch = async (url, options = {}, navigation) => {
  const accessToken = await getToken("accessToken");

  const headers = {
    ...(options.headers || {}),
    Authorization: accessToken ? `Bearer ${accessToken}` : "",
    "Content-Type": "application/json",
  };

  let response = await fetch(`${API_BASE_URL}${url}`, { ...options, headers });

  // If token expired → try a single shared refresh, then retry once.
  if (response.status === 401) {
    const refreshToken = await getToken("refreshToken");
    const newAccessToken = await refreshAccessToken(refreshToken);

    if (newAccessToken) {
      response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers: { ...headers, Authorization: `Bearer ${newAccessToken}` },
      });
    } else {
      await removeTokens();
      if (navigation) navigation.replace("Login");
    }
  }

  return response;
};
