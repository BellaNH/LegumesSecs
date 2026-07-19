import { create } from "zustand";

import { clearAccessToken, setAccessToken } from "../services/token-storage";
import type { AuthSession, AuthUser } from "../types/auth";

type AuthStatus = "loading" | "authenticated" | "anonymous";

type AuthState = {
  user: AuthUser | null;
  status: AuthStatus;
  setSession: (session: AuthSession) => void;
  clearSession: () => void;
  finishLoading: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: "loading",
  setSession: (session) => {
    setAccessToken(session.accessToken);
    set({
      user: session.user,
      status: "authenticated",
    });
  },
  clearSession: () => {
    clearAccessToken();
    set({
      user: null,
      status: "anonymous",
    });
  },
  finishLoading: () => {
    set((state) => ({
      status: state.user ? "authenticated" : "anonymous",
    }));
  },
}));
