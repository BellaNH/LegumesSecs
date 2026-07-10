import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { DataProvider, useData } from "./contexts/DataContext";
import { UIProvider, useUI } from "./contexts/UIContext";
import { LanguageProvider } from "./i18n/LanguageContext";
import { useMemo, useCallback } from "react";
import API_BASE_URL from "./config/api";

export const AppProvider = ({ children }) => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <DataProvider>
          <UIProvider>
            {children}
          </UIProvider>
        </DataProvider>
      </AuthProvider>
    </LanguageProvider>
  );
};

export const useGlobalContext = () => {
  const auth = useAuth();
  const data = useData();
  const ui = useUI();

  const handleUpdateParcelle = useCallback(async (id) => {
    const parcelleData = await data.fetchParcelle(id);
    if (parcelleData) {
      ui.setModifiedParcelle(parcelleData);
    }
  }, [data, ui]);

  const getAuthHeader = useCallback(() => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }, []);

  return useMemo(() => ({
    ...auth,
    ...data,
    ...ui,
    url: API_BASE_URL,
    getAuthHeader,
    handleUpdateParcelle,
  }), [auth, data, ui, getAuthHeader, handleUpdateParcelle]);
};
