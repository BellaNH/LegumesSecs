import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { setupApiClient } from '../services/api';
import authService from '../services/api/authService';
import { clearAccessToken, getAccessToken, setAccessToken } from '../services/api/tokenStorage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const logout = useCallback(async () => {
    await authService.logout();
    clearAccessToken();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const loadCurrentUser = useCallback(async () => {
    const userData = await authService.getCurrentUser();
    setUser(userData);
    setIsAuthenticated(true);
    return userData;
  }, []);

  const login = useCallback(async (accessToken) => {
    setAccessToken(accessToken);
    await loadCurrentUser();
  }, [loadCurrentUser]);

  const refreshAccessToken = useCallback(async () => {
    try {
      const session = await authService.refreshSession();
      setAccessToken(session.accessToken);
      return session.accessToken;
    } catch {
      clearAccessToken();
      setUser(null);
      setIsAuthenticated(false);
      return null;
    }
  }, []);

  useEffect(() => {
    setupApiClient(refreshAccessToken, () => {
      clearAccessToken();
      setUser(null);
      setIsAuthenticated(false);
    });

    let active = true;

    const restoreSession = async () => {
      try {
        const session = await authService.refreshSession();
        if (!active) return;
        setAccessToken(session.accessToken);
        await loadCurrentUser();
      } catch {
        if (!active) return;
        clearAccessToken();
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        if (active) {
          setAuthLoading(false);
        }
      }
    };

    restoreSession();

    return () => {
      active = false;
    };
  }, [loadCurrentUser, refreshAccessToken]);

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
      getAccessToken,
    }),
    [user, isAuthenticated, authLoading, login, logout, refreshAccessToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
