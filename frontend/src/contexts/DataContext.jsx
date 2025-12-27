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
      const data = await locationService.getWilayas();
      // Handle paginated responses
      setWilayas(Array.isArray(data) ? data : (data?.results || []));
    } catch (error) {
      // Error handled by interceptor
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
      const data = await especeService.getAll();
      // Handle paginated responses
      setEspeces(Array.isArray(data) ? data : (data?.results || []));
    } catch (error) {
      // Error handled by interceptor
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
      const data = await agriculteurService.getAll();
      // Handle paginated responses
      setAgriculteurs(Array.isArray(data) ? data : (data?.results || []));
    } catch (error) {
      // Error handled by interceptor
      setAgriculteurs([]);
    }
  }, []);

  const fetchRoles = useCallback(async () => {
    try {
      const data = await roleService.getAll();
      // Handle paginated responses
      setRoles(Array.isArray(data) ? data : (data?.results || []));
    } catch (error) {
      // Error handled by interceptor
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
      fetchWilaya();
      fetchSubdivisions();
      fetchCommunes();
      fetchEspeces();
      fetchRoles();
      fetchObjectifs();
      fetchAgriculteurs();
      fetchExploitations();
      fetchExploitationWithParcelles();
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

