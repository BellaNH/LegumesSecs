import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios"
import axiosInstance from "./axios.js"
import {jwtDecode} from "jwt-decode";
const AppContext = createContext();
const AppProvider = ({ children }) => {

  
  const url = "https://legumessecs.onrender.com"
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [wilayas,setWilayas] = useState([])
  const [subdivisions, setSubdivisions] = useState([])
  const [communes, setCommunes] = useState([])
  const [especes, setEspeces] = useState([])
  const [token,setToken] = useState("") 
  const [roles,setRoles] = useState([])
  const [objectifs,setObjectifs] = useState([])
  const [agriculteurs,setAgriculteurs] = useState([])
  const [exploitations,setExploitations] = useState([])
  const [parcelles,setParcelles] = useState([])
  const [exploitationId,setExploitationId] = useState()
  const [modifiedParcelle,setModifiedParcelle] = useState()
  const [selectedAgriculteur,setSelectedAgriculteur] = useState()
  const [selectedExploi,setSelectedExploi] = useState()
  const [sliderStatus,setSliderStatus] = useState("create")
  const [currentUserPermissions,setCurrentUserPermissions] = useState([])
  const [defaultPermissions,setDefaultPermissions] = useState(
    [
    {"model": "Agriculteur", "create": false, "retrieve": false, "update": false, "destroy": false},
    {"model": "Exploitation", "create": false, "retrieve": false, "update": false, "destroy": false},
    {"model": "Objectif", "create": false, "retrieve": false, "update": false, "destroy": false},
    {"model": "Utilisateur", "create": false, "retrieve": false, "update": false, "destroy": false},

]
  )

  const initalizeUserPermissions = ()=>{
      if(sliderStatus==="create"){
        setCurrentUserPermissions(defaultPermissions)
      }
  }
 
  useEffect(()=>{
    console.log(sliderStatus)
    initalizeUserPermissions()
  },[sliderStatus])

  const getAuthHeader = () => {
    const token = localStorage.getItem("token"); 
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token)
    if (token) {
       axios.get(`${url}/api/me/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(response => {
        setUser(response.data)
        console.log(response)
        setIsAuthenticated(true);
      }).catch(() => {
        localStorage.removeItem("token");
        setUser(null);
        setIsAuthenticated(false);
        
      });
    } 
    }, []);
    useEffect(()=>{console.log(user)},[setUser])

    const fetchWilaya = async ()=>{
      const response = await axiosInstance.get(`${url}/api/wilaya/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      console.log(response.data)
       setWilayas(response.data)    
    }
    const fetchSubdivisions = async () => {
          try {
            const res = await axios.get(`${url}/api/subdivision/`, {
              headers: {
                 Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });
            console.log(res.data)
            setSubdivisions(res.data);
          } catch (error) {
            console.error("Erreur de chargement des subdivisions", error);
          }
    };
    const fetchCommunes = async () => {
      try {
        const res = await axios.get(`${url}/api/commune/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCommunes(res.data);
      } catch (error) {
        console.error("Erreur de chargement des subdivisions", error);
      }
    };
    const fetchEspeces = async () => {
      try {
        const response = await axios.get(`${url}/api/espece/`, {
          headers: {
             Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setEspeces(response.data);
        console.log(response)
      } catch (error) {
          console.error('Erreur lors de la récupération des Especes', error);        
      }
    };
    const fetchObjectifs = async ()=>{
      try{
        const response = await axios.get(`${url}/api/objectif/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
    }
        )
        console.log(response.data)
        setObjectifs(response.data)
      }catch(error){
        console.log("error")
      }
      
    }
    const fetchAgriculteurs = async ()=>{
      try{
        const response = await axios.get(`${url}/api/agriculteur/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
    }
        )
        console.log(response.data)
        setAgriculteurs(response.data)
      }catch(error){
        console.log(error)
      }
    }

    useEffect(() => {
      if (user) {
        console.log("User is now available:", user);
        fetchWilaya();
        fetchSubdivisions();
        fetchCommunes();
        fetchEspeces();
        fetchRoles()
        fetchObjectifs()
        fetchAgriculteurs()
        fetchExploitations()
        fetchExploitationWithParcelles()
        
      }
    }, [user]);
  const fetchRoles = async ()=>{
    try{
      const response = await axiosInstance.get(`${url}/api/role`,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }})
      console.log(response)
      setRoles(response.data)
    }catch(error){
      console.log("roles not fetched ")
    }
    
  }
  const fetchExploitations = async ()=>{
    try{
      const response = await axiosInstance.get(`${url}/api/exploitation`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }}
      )
      console.log(response)
      setExploitations(response.data)
    }catch(error){
      console.log("roles not fetched ")
    }
    
  }

  const fetchExploitationWithParcelles = async ()=>{
    try{
      const response = await axios.get(`${url}/api/exploitation-parcelles`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }}
      )
      console.log(response)
      setExploitations(response.data)
    }catch(error){
      console.log("parcelles not fetched ")
    }
    
  }
  const login = async (token)=>{
    localStorage.setItem("token", token); 
    const userResponse = await axios.get(`${url}/api/me/`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
    });
    console.log(userResponse.data);
    setUser(userResponse.data)
    setIsAuthenticated(true)
    
  }

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
    
  };
  const handleUpdateParcelle = async (id)=>{
    try{
      const response = await axios.get(`${url}/api/parcelle/${id}/`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
    })
    setModifiedParcelle(response.data)

    }
    catch(error){}
  }
 useEffect(()=>{console.log(agriculteurs)},[agriculteurs])
return (
    <AppContext.Provider value={{
      isAuthenticated, 
      setIsAuthenticated,
      logout,
      login,
      user, 
      setUser,
      wilayas,
      setWilayas,
      fetchWilaya,
      url,
      subdivisions, 
      setSubdivisions,
      communes,
      especes,
      setEspeces,
      getAuthHeader,
      roles,
      setRoles,
      objectifs,
      setObjectifs,
      agriculteurs,
      setAgriculteurs,
      exploitations,
      setExploitations,
      exploitationId,
      setExploitationId,
      parcelles,
      setParcelles,
      fetchExploitationWithParcelles,
      modifiedParcelle,
      setModifiedParcelle,
      fetchEspeces,
      fetchObjectifs,
      fetchExploitations,
      fetchAgriculteurs,
      selectedAgriculteur,
      setSelectedAgriculteur,
      selectedExploi,
      setSelectedExploi,
      fetchSubdivisions,
      fetchCommunes,
      fetchRoles,
      setSliderStatus,
      sliderStatus,
      currentUserPermissions,
      setCurrentUserPermissions,
      defaultPermissions,
      }}>
      {children}
    </AppContext.Provider>
  );
};
export const useGlobalContext = () => {
  return useContext(AppContext);
};
export { AppContext, AppProvider };