import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { setupApiClient } from "../services/api";
import authService from "../services/api/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
    } catch (error) {
      logout();
      return null;
    }
  }, [logout]);

  const login = useCallback(async (accessToken, refreshToken) => {
    localStorage.setItem("token", accessToken);
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }
    
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      logout();
    }
  }, [logout]);

  useEffect(() => {
    setupApiClient(refreshAccessToken, logout);
    
    const token = localStorage.getItem("token");
    if (token) {
      authService.getCurrentUser()
        .then(data => {
          setUser(data);
          setIsAuthenticated(true);
        })
        .catch(() => {
          logout();
        });
    }
  }, [logout, refreshAccessToken]);

  const value = useMemo(() => ({
    user,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
    login,
    logout,
    refreshAccessToken,
  }), [user, isAuthenticated, login, logout, refreshAccessToken]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;




















