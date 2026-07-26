import { create } from "zustand";
import { setCachedToken } from "../lib/api";
import type { Admin } from "../types";

interface AuthState {
  token: string | null;
  admin: Admin | null;
  setAuth: (token: string, admin: Admin) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  admin: null,

  setAuth: (token, admin) => {
    localStorage.setItem("auth", JSON.stringify({ token, admin }));
    setCachedToken(token);
    set({ token, admin });
  },

  logout: () => {
    localStorage.removeItem("auth");
    setCachedToken(null);
    set({ token: null, admin: null });
  },

  hydrate: () => {
    const stored = localStorage.getItem("auth");
    if (stored) {
      try {
        const { token, admin } = JSON.parse(stored);
        if (token && admin) {
          setCachedToken(token);
          set({ token, admin });
        }
      } catch {
        localStorage.removeItem("auth");
      }
    }
  },
}));
