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
    } catch (error) {
      logout();
      return null;
    }
  }, [logout]);

  const login = useCallback(async (accessToken, refreshToken) => {
    // DETECTIVE LOG: Storing tokens
    console.log("💾 [AUTH] Storing access token in localStorage");
    localStorage.setItem("token", accessToken);
    
    // Store refresh token if provided
    if (refreshToken) {
      console.log("💾 [AUTH] Storing refresh token in localStorage");
      localStorage.setItem("refreshToken", refreshToken);
    }
    
    try {
      // DETECTIVE LOG: Fetching user data
      console.log("📡 [AUTH] Fetching user data from /api/me/");
      console.log("🔑 [AUTH] Using token:", accessToken.substring(0, 20) + "...");
      
      const userResponse = await axios.get(`${API_BASE_URL}/api/me/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      
      // DETECTIVE LOG: User data received
      console.log("✅ [AUTH] User data received successfully");
      console.log("👤 [AUTH] Full user response:", userResponse.data);
      console.log("🎭 [AUTH] User role:", userResponse.data?.role);
      console.log("📋 [AUTH] User permissions:", userResponse.data?.permissions);
      
      setUser(userResponse.data);
      setIsAuthenticated(true);
      
      console.log("✅ [AUTH] User state updated, authentication complete");
    } catch (error) {
      console.error("❌ [AUTH] Error fetching user data:", error);
      console.error("❌ [AUTH] Error response:", error.response?.data);
      console.error("❌ [AUTH] Error status:", error.response?.status);
      console.error("❌ [AUTH] Error headers:", error.response?.headers);
      console.error("❌ [AUTH] Full error object:", error);
      // Don't silently logout - show the error
      throw error; // Re-throw so Login component can see it
    }
  }, []);

  useEffect(() => {
    setupApiClient(refreshAccessToken, logout);
    
    const token = localStorage.getItem("token");
    console.log("🔄 [AUTH] Checking for existing token on page load");
    if (token) {
      console.log("🔑 [AUTH] Token found, fetching user data");
      axios.get(`${API_BASE_URL}/api/me/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          console.log("✅ [AUTH] User data fetched on page load:", response.data);
          setUser(response.data);
          setIsAuthenticated(true);
        })
        .catch(async (error) => {
          console.error("❌ [AUTH] Error fetching user on page load:", error);
          console.error("❌ [AUTH] Error response:", error.response?.data);
          
          // If 401 (token expired), try to refresh first
          if (error.response?.status === 401) {
            console.log("🔄 [AUTH] Token expired, attempting refresh...");
            try {
              const newToken = await refreshAccessToken();
              if (newToken) {
                // Retry fetching user data with new token
                const userResponse = await axios.get(`${API_BASE_URL}/api/me/`, {
                  headers: {
                    Authorization: `Bearer ${newToken}`
                  }
                });
                console.log("✅ [AUTH] User data fetched after refresh:", userResponse.data);
                setUser(userResponse.data);
                setIsAuthenticated(true);
                return;
              }
            } catch (refreshError) {
              console.error("❌ [AUTH] Refresh failed:", refreshError);
            }
          }
          
          // If refresh failed or error is not 401, logout
          logout();
        })
        .finally(() => {
          setAuthLoading(false);
        });
    } else {
      console.log("ℹ️ [AUTH] No token found, user not authenticated");
      setAuthLoading(false);
    }
  }, [logout, refreshAccessToken]);

  const value = useMemo(() => ({
    user,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
    authLoading,
    login,
    logout,
    refreshAccessToken,
  }), [user, isAuthenticated, authLoading, login, logout, refreshAccessToken]);

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





















