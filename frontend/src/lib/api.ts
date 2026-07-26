import axios from "axios";
import { API_BASE } from "./apiBase";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

let cachedToken: string | null = null;

export function setCachedToken(token: string | null) {
  cachedToken = token;
}

function getStoredToken(): string | null {
  if (cachedToken) return cachedToken;
  try {
    const stored = localStorage.getItem("auth");
    if (stored) {
      const { token } = JSON.parse(stored);
      cachedToken = token || null;
      return cachedToken;
    }
  } catch { /* ignore */ }
  return null;
}

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      cachedToken = null;
      localStorage.removeItem("auth");
      window.location.href = "/admin/login";
    }
    return Promise.reject(err);
  }
);

export default api;
