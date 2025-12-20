import { createContext, useContext, useState, useMemo, useCallback, useEffect } from "react";

const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [exploitationId, setExploitationId] = useState();
  const [modifiedParcelle, setModifiedParcelle] = useState();
  const [selectedAgriculteur, setSelectedAgriculteur] = useState();
  const [selectedExploi, setSelectedExploi] = useState();
  const [sliderStatus, setSliderStatus] = useState("create");
  const [currentUserPermissions, setCurrentUserPermissions] = useState([]);
  
  const defaultPermissions = useMemo(() => [
    { "model": "Agriculteur", "create": false, "retrieve": false, "update": false, "destroy": false },
    { "model": "Exploitation", "create": false, "retrieve": false, "update": false, "destroy": false },
    { "model": "Objectif", "create": false, "retrieve": false, "update": false, "destroy": false },
    { "model": "Utilisateur", "create": false, "retrieve": false, "update": false, "destroy": false },
  ], []);

  const initializeUserPermissions = useCallback(() => {
    if (sliderStatus === "create") {
      setCurrentUserPermissions(defaultPermissions);
    }
  }, [sliderStatus, defaultPermissions]);

  useEffect(() => {
    initializeUserPermissions();
  }, [initializeUserPermissions]);

  const value = useMemo(() => ({
    exploitationId,
    setExploitationId,
    modifiedParcelle,
    setModifiedParcelle,
    selectedAgriculteur,
    setSelectedAgriculteur,
    selectedExploi,
    setSelectedExploi,
    sliderStatus,
    setSliderStatus,
    currentUserPermissions,
    setCurrentUserPermissions,
    defaultPermissions,
    initializeUserPermissions,
  }), [
    exploitationId,
    modifiedParcelle,
    selectedAgriculteur,
    selectedExploi,
    sliderStatus,
    currentUserPermissions,
    defaultPermissions,
    initializeUserPermissions,
  ]);

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useUI must be used within a UIProvider");
  }
  return context;
};

export default UIContext;

