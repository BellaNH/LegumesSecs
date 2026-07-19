import { useEffect } from "react";
import type { ReactNode } from "react";

import { refreshSessionRequest } from "../services/auth.api";
import { useAuthStore } from "../store/auth.store";

type AuthBootstrapProps = {
  children: ReactNode;
};

export function AuthBootstrap({ children }: AuthBootstrapProps) {
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);

  useEffect(() => {
    let active = true;

    const restoreSession = async () => {
      try {
        const session = await refreshSessionRequest();

        if (active) {
          setSession(session);
        }
      } catch {
        if (active) {
          clearSession();
        }
      }
    };

    void restoreSession();

    return () => {
      active = false;
    };
  }, [clearSession, setSession]);

  return children;
}
