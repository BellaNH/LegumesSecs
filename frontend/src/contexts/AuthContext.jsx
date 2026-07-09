import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { setupApiClient } from "../services/api";
import authService from "../services/api/authService";
import API_BASE_URL from "../config/api";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    if (refreshToken) {
      await authService.logout(refreshToken);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const refreshAccessToken = useCallback(async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      logout();
      return null;
    }

    try {
      const { access, refresh: newRefresh } = await authService.refreshToken(refreshToken);
      localStorage.setItem("token", access);
      if (newRefresh) {
        localStorage.setItem("refreshToken", newRefresh);
      }
      return access;
    } catch {
      logout();
      return null;
    }
  }, [logout]);

  const login = useCallback(async (accessToken, refreshToken) => {
    localStorage.setItem("token", accessToken);

    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }

    const userResponse = await axios.get(`${API_BASE_URL}/api/me/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    setUser(userResponse.data);
    setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    setupApiClient(refreshAccessToken, logout);

    const token = localStorage.getItem("token");
    if (!token) {
      setAuthLoading(false);
      return;
    }

    axios
      .get(`${API_BASE_URL}/api/me/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUser(response.data);
        setIsAuthenticated(true);
      })
      .catch(async (error) => {
        if (error.response?.status === 401) {
          try {
            const newToken = await refreshAccessToken();
            if (newToken) {
              const userResponse = await axios.get(`${API_BASE_URL}/api/me/`, {
                headers: {
                  Authorization: `Bearer ${newToken}`,
                },
              });
              setUser(userResponse.data);
              setIsAuthenticated(true);
              return;
            }
          } catch {
            logout();
            return;
          }
        }

        logout();
      })
      .finally(() => {
        setAuthLoading(false);
      });
  }, [logout, refreshAccessToken]);

  const value = useMemo(
    () => ({
      user,
      setUser,
      isAuthenticated,
      setIsAuthenticated,
      authLoading,
      login,
      logout,
      refreshAccessToken,
    }),
    [user, isAuthenticated, authLoading, login, logout, refreshAccessToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
