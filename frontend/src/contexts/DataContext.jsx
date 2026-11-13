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
  const [isDataLoading, setIsDataLoading] = useState(false);

  const fetchWilaya = useCallback(async () => {
    try {
      const data = await locationService.getWilayas();
      const wilayasData = Array.isArray(data) ? data : (data?.results || []);
      setWilayas(wilayasData);
      return wilayasData;
    } catch {
      setWilayas([]);
      return [];
    }
  }, []);

  const fetchSubdivisions = useCallback(async () => {
    try {
      const data = await locationService.getSubdivisions();
      const list = Array.isArray(data) ? data : (data?.results || []);
      setSubdivisions(list);
      return list;
    } catch {
      setSubdivisions([]);
      return [];
    }
  }, []);

  const fetchCommunes = useCallback(async () => {
    try {
      const data = await locationService.getCommunes();
      const list = Array.isArray(data) ? data : (data?.results || []);
      setCommunes(list);
      return list;
    } catch {
      setCommunes([]);
      return [];
    }
  }, []);

  const fetchEspeces = useCallback(async () => {
    try {
      const data = await especeService.getAll();
      const especesData = Array.isArray(data) ? data : (data?.results || []);
      setEspeces(especesData);
      return especesData;
    } catch {
      setEspeces([]);
      return [];
    }
  }, []);

  const fetchObjectifs = useCallback(async () => {
    try {
      const data = await objectifService.getAll();
      const list = Array.isArray(data) ? data : (data?.results || []);
      setObjectifs(list);
      return list;
    } catch {
      setObjectifs([]);
      return [];
    }
  }, []);

  const fetchAgriculteurs = useCallback(async () => {
    try {
      const data = await agriculteurService.getAll();
      const agriculteursData = Array.isArray(data) ? data : (data?.results || []);
      setAgriculteurs(agriculteursData);
      return agriculteursData;
    } catch {
      setAgriculteurs([]);
      return [];
    }
  }, []);

  const fetchRoles = useCallback(async () => {
    try {
      const data = await roleService.getAll();
      const rolesData = Array.isArray(data) ? data : (data?.results || []);
      setRoles(rolesData);
      return rolesData;
    } catch {
      setRoles([]);
      return [];
    }
  }, []);

  const fetchExploitations = useCallback(async () => {
    try {
      const data = await exploitationService.getAll();
      const list = Array.isArray(data) ? data : (data?.results || []);
      setExploitations(list);
      return list;
    } catch {
      setExploitations([]);
      return [];
    }
  }, []);

  const fetchExploitationWithParcelles = useCallback(async () => {
    try {
      const data = await exploitationService.getWithParcelles();
      const list = Array.isArray(data) ? data : (data?.results || []);
      setExploitations(list);
      return list;
    } catch {
      setExploitations([]);
      return [];
    }
  }, []);

  const fetchParcelle = useCallback(async (id) => {
    try {
      return await parcelleService.getById(id);
    } catch {
      return null;
    }
  }, []);

  // Only preload small reference lists after login.
  // Heavy lists (communes, agriculteurs, exploitations, objectifs) load per page.
  useEffect(() => {
    if (!user) {
      setWilayas([]);
      setSubdivisions([]);
      setCommunes([]);
      setEspeces([]);
      setRoles([]);
      setObjectifs([]);
      setAgriculteurs([]);
      setExploitations([]);
      setParcelles([]);
      setIsDataLoading(false);
      return undefined;
    }

    let cancelled = false;
    setIsDataLoading(true);

    Promise.all([fetchWilaya(), fetchEspeces(), fetchRoles()]).finally(() => {
      if (!cancelled) {
        setIsDataLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [user, fetchWilaya, fetchEspeces, fetchRoles]);

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
    isDataLoading,
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
    isDataLoading,
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
