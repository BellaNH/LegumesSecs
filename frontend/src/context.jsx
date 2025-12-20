import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { DataProvider, useData } from "./contexts/DataContext";
import { UIProvider, useUI } from "./contexts/UIContext";
import { useMemo, useCallback } from "react";

export const AppProvider = ({ children }) => {
  return (
    <AuthProvider>
      <DataProvider>
        <UIProvider>
          {children}
        </UIProvider>
      </DataProvider>
    </AuthProvider>
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
    url: "https://legumessecs.onrender.com",
    getAuthHeader,
    handleUpdateParcelle,
  }), [auth, data, ui, getAuthHeader, handleUpdateParcelle]);
};
