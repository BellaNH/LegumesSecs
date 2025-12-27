import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { locationService, especeService, objectifService, agriculteurService, exploitationService, roleService, parcelleService } from "../services/api";
import { useAuth } from "./AuthContext";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const { user } = useAuth();
  
  const [wilayas, setWilayas] = useState([]);
  const [subdivisions, setSubdivisions] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [especes, setEspeces] = useState([]);
  const [roles, setRoles] = useState([]);
  const [objectifs, setObjectifs] = useState([]);
  const [agriculteurs, setAgriculteurs] = useState([]);
  const [exploitations, setExploitations] = useState([]);
  const [parcelles, setParcelles] = useState([]);

  const fetchWilaya = useCallback(async () => {
    try {
      console.log("📡 [DATA] Fetching wilayas...");
      const data = await locationService.getWilayas();
      // Handle paginated responses
      const wilayasData = Array.isArray(data) ? data : (data?.results || []);
      console.log("✅ [DATA] Wilayas fetched:", wilayasData.length, "items");
      setWilayas(wilayasData);
    } catch (error) {
      console.error("❌ [DATA] Error fetching wilayas:", error);
      console.error("❌ [DATA] Error response:", error.response?.data);
      setWilayas([]);
    }
  }, []);

  const fetchSubdivisions = useCallback(async () => {
    try {
      const data = await locationService.getSubdivisions();
      // Handle paginated responses
      setSubdivisions(Array.isArray(data) ? data : (data?.results || []));
    } catch (error) {
      // Error handled by interceptor
      setSubdivisions([]);
    }
  }, []);

  const fetchCommunes = useCallback(async () => {
    try {
      const data = await locationService.getCommunes();
      // Handle paginated responses
      setCommunes(Array.isArray(data) ? data : (data?.results || []));
    } catch (error) {
      // Error handled by interceptor
      setCommunes([]);
    }
  }, []);

  const fetchEspeces = useCallback(async () => {
    try {
      console.log("📡 [DATA] Fetching especes...");
      const data = await especeService.getAll();
      // Handle paginated responses
      const especesData = Array.isArray(data) ? data : (data?.results || []);
      console.log("✅ [DATA] Especes fetched:", especesData.length, "items");
      setEspeces(especesData);
    } catch (error) {
      console.error("❌ [DATA] Error fetching especes:", error);
      console.error("❌ [DATA] Error response:", error.response?.data);
      setEspeces([]);
    }
  }, []);

  const fetchObjectifs = useCallback(async () => {
    try {
      const data = await objectifService.getAll();
      // Handle paginated responses
      setObjectifs(Array.isArray(data) ? data : (data?.results || []));
    } catch (error) {
      // Error handled by interceptor
      setObjectifs([]);
    }
  }, []);

  const fetchAgriculteurs = useCallback(async () => {
    try {
      console.log("📡 [DATA] Fetching agriculteurs...");
      const data = await agriculteurService.getAll();
      // Handle paginated responses
      const agriculteursData = Array.isArray(data) ? data : (data?.results || []);
      console.log("✅ [DATA] Agriculteurs fetched:", agriculteursData.length, "items");
      setAgriculteurs(agriculteursData);
    } catch (error) {
      console.error("❌ [DATA] Error fetching agriculteurs:", error);
      console.error("❌ [DATA] Error response:", error.response?.data);
      setAgriculteurs([]);
    }
  }, []);

  const fetchRoles = useCallback(async () => {
    try {
      console.log("📡 [DATA] Fetching roles...");
      const data = await roleService.getAll();
      // Handle paginated responses
      const rolesData = Array.isArray(data) ? data : (data?.results || []);
      console.log("✅ [DATA] Roles fetched:", rolesData.length, "items");
      setRoles(rolesData);
    } catch (error) {
      console.error("❌ [DATA] Error fetching roles:", error);
      console.error("❌ [DATA] Error response:", error.response?.data);
      setRoles([]);
    }
  }, []);

  const fetchExploitations = useCallback(async () => {
    try {
      const data = await exploitationService.getAll();
      // Handle paginated responses
      setExploitations(Array.isArray(data) ? data : (data?.results || []));
    } catch (error) {
      // Error handled by interceptor
      setExploitations([]);
    }
  }, []);

  const fetchExploitationWithParcelles = useCallback(async () => {
    try {
      const data = await exploitationService.getWithParcelles();
      // Handle paginated responses
      setExploitations(Array.isArray(data) ? data : (data?.results || []));
    } catch (error) {
      // Error handled by interceptor
      setExploitations([]);
    }
  }, []);

  const fetchParcelle = useCallback(async (id) => {
    try {
      const data = await parcelleService.getById(id);
      return data;
    } catch (error) {
      // Error handled by interceptor
      return null;
    }
  }, []);

  useEffect(() => {
    if (user) {
      console.log("📊 [DATA] User authenticated, fetching all data...");
      console.log("👤 [DATA] User:", user);
      fetchWilaya();
      fetchSubdivisions();
      fetchCommunes();
      fetchEspeces();
      fetchRoles();
      fetchObjectifs();
      fetchAgriculteurs();
      fetchExploitations();
      fetchExploitationWithParcelles();
    } else {
      console.log("ℹ️ [DATA] No user, skipping data fetch");
    }
  }, [user, fetchWilaya, fetchSubdivisions, fetchCommunes, fetchEspeces, fetchRoles, fetchObjectifs, fetchAgriculteurs, fetchExploitations, fetchExploitationWithParcelles]);

  const value = useMemo(() => ({
    wilayas,
    setWilayas,
    subdivisions,
    setSubdivisions,
    communes,
    setCommunes,
    especes,
    setEspeces,
    roles,
    setRoles,
    objectifs,
    setObjectifs,
    agriculteurs,
    setAgriculteurs,
    exploitations,
    setExploitations,
    parcelles,
    setParcelles,
    fetchWilaya,
    fetchSubdivisions,
    fetchCommunes,
    fetchEspeces,
    fetchObjectifs,
    fetchAgriculteurs,
    fetchRoles,
    fetchExploitations,
    fetchExploitationWithParcelles,
    fetchParcelle,
  }), [
    wilayas,
    subdivisions,
    communes,
    especes,
    roles,
    objectifs,
    agriculteurs,
    exploitations,
    parcelles,
    fetchWilaya,
    fetchSubdivisions,
    fetchCommunes,
    fetchEspeces,
    fetchObjectifs,
    fetchAgriculteurs,
    fetchRoles,
    fetchExploitations,
    fetchExploitationWithParcelles,
    fetchParcelle,
  ]);

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

export default DataContext;

