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

// --- API fetch wrapper with auto-refresh ---
export const apiFetch = async (url, options = {}, navigation) => {
  let accessToken = await getToken("accessToken");
  let refreshToken = await getToken("refreshToken");

  let headers = {
    ...(options.headers || {}),
    Authorization: accessToken ? `Bearer ${accessToken}` : "",
    "Content-Type": "application/json",
  };

  let response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  // If token expired → try refresh
  if (response.status === 401) {
    log("⚠️ Access token expired, trying refresh…");

    if (refreshToken) {
      const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (refreshRes.ok) {
        const data = await refreshRes.json();
        const newAccessToken = data.accessToken;

        // Save only new access token
        if (newAccessToken) await setToken("accessToken", newAccessToken);

        // Retry original request with fresh access token
        response = await fetch(`${API_BASE_URL}${url}`, {
          ...options,
          headers: {
            ...headers,
            Authorization: `Bearer ${newAccessToken}`,
          },
        });
      } else {
        await removeTokens();
        if (navigation) navigation.replace("Login"); // redirect to login screen
        return refreshRes; // stop here
      }
    } else {
      await removeTokens();
      if (navigation) navigation.replace("Login");
      return response; // stop here
    }
  }

  return response;
};
