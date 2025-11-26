import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";

const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

// --- Helper functions ---
const getToken = async (key) => {
  const token = await SecureStore.getItemAsync(key);
  console.log(`🔑 getToken(${key}):`, token);
  return token;
};

const setToken = async (key, value) => {
  await SecureStore.setItemAsync(key, value);
  console.log(`✅ setToken(${key}):`, value);
};

const removeTokens = async () => {
  await SecureStore.deleteItemAsync("accessToken");
  await SecureStore.deleteItemAsync("refreshToken");
  console.log("🗑️ Tokens removed!");
};

// --- API fetch wrapper with auto-refresh ---
export const apiFetch = async (url, options = {}, navigation) => {
  console.log("🌍 apiFetch called:", url);

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

  console.log("📩 First response status:", response.status);

  // If token expired → try refresh
  if (response.status === 401) {
    console.log("⚠️ Access token expired, trying refresh...");

    if (refreshToken) {
      const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      console.log("🔄 Refresh response status:", refreshRes.status);

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

        console.log("📩 Retried request status:", response.status);
      } else {
        console.log("❌ Refresh failed (expired/invalid). Logging out...");
        await removeTokens();
        if (navigation) navigation.replace("Login"); // redirect to login screen
        return refreshRes; // stop here
      }
    } else {
      console.log("❌ No refresh token found, logging out");
      await removeTokens();
      if (navigation) navigation.replace("Login");
      return response; // stop here
    }
  }

  return response;
};
