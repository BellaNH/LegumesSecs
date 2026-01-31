import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  TextField,
  Snackbar, 
  Alert
} from "@mui/material";
import axios from "axios";
import SearchIcon from '@mui/icons-material/Search'; 
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { useGlobalContext } from "../../context";
import InputAdornment from '@mui/material/InputAdornment';
import Localisation from "../pics/Localisation.png"
import { FaTrash, FaEdit } from 'react-icons/fa';
const Commune = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const {url,fetchCommunes,communes,setCommunes,user}= useGlobalContext()
  const navigate = useNavigate()
  const [id, setid] = useState(null)
  const [editedCommuneName, setEditedCommuneName] = useState('')
  const [errorMessage, setErrorMessage] = useState(""); 
      const [successMessage, setSuccessMessage] = useState(""); 
      const [openError, setOpenError] = useState(false);
      const [openSuccess, setOpenSuccess] = useState(false);
  const [communeInfos,setCommuneInfos] =  useState({
      nom: "",
      subdiv_id:""
  })
    
 const filterCommunes = communes?.filter(com =>
  com.nom?.toLowerCase().includes(searchQuery.toLowerCase())
);
  const handleDelete = async (id) => {
      try{
      await axios.delete(`${url}/api/commune/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setSuccessMessage(`Commune est supprimée avec succès ✅`);
      setOpenSuccess(true);
      fetchCommunes()
    }catch(error){
      setErrorMessage("Erreur lors de l'ajout de la commune");
      setOpenError(true);
    }
     
    
  }

  const handleEdit = (commune) => {
  setid(commune.id);
  setEditedCommuneName(commune.nom);
  setCommuneInfos({
    nom: commune.nom,
    subdiv_id: commune.subdivision?.id || ""  
  });
};

const handleChange = (newName) => {
  setEditedCommuneName(newName);
  setCommuneInfos((prev) => ({
    ...prev,
    nom: newName
  }));
};

const handleUpdate = async (communeId) => {
  const payload = {
    nom: communeInfos.nom
  };

  if (communeInfos.subdiv_id) {
    payload.subdiv_id = communeInfos.subdiv_id;
  }

  try {
    await axios.patch(`${url}/api/commune/${communeId}/`, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    setSuccessMessage(`Commune est modifiée avec succès ✅`);
    setOpenSuccess(true);
    setid(null);
    setEditedCommuneName("");
    fetchCommunes();
  } catch (error) {
    setErrorMessage("Erreur lors de la mise à jour");
    setOpenError(true);
  }
};

   useEffect(()=>{console.log(editedCommuneName)},[editedCommuneName])
   useEffect(()=>{console.log(communeInfos)},[communeInfos])
return (
  <div className="w-[100%] h-fit mt-10 mx-auto flex flex-col items-center">
  <div className="w-[85%] flex flex-col mb-16">
  <div className='flex align-center gap-2'> 
            <img src={Localisation} alt="localisation" className='w-10 h-10'/>
            <h2 className="text-3xl font-bold text-left text-green-600 mb-6">
             Communes
           </h2>
  </div>

  <div className="flex items-center justify-center gap-4 mb-6">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Rechercher une commune"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md pl-10 focus:outline-none focus:ring-2 focus:ring-green-600"
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <SearchIcon />
          </div>
        </div>
  
        <button
          onClick={() => navigate("/ajouter-commune")}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-md text-sm"
        >
          Ajouter
        </button>
      </div>

  <div className="bg-white rounded-xl overflow-hidden shadow-md">
    <table className="min-w-full text-left table-auto border border-gray-200">
      <thead className="bg-green-600 text-white">
        <tr>
          <th className="px-4 py-3 text-sm font-semibold">ID</th>
          <th className="px-4 py-3 text-sm font-semibold">Nom</th>
          <th className="px-4 py-3 text-sm font-semibold">Subdivision</th>
          <th className="px-4 py-3 text-sm font-semibold text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {filterCommunes.map((com) => (
          <tr key={com.id} className="even:bg-gray-50 hover:bg-green-50 transition duration-200">
            <td className="px-4 py-3 text-sm">{com.id}</td>
            <td className="px-4 py-3 text-[16px] text-gray-800">
              {id === com.id ? (
                <input
                  value={editedCommuneName}
                  onChange={(e) => handleChange(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-1 text-sm"
                />
              ) : (
                com.nom
              )}
            </td>
            <td className="px-4 py-3 text-[16px] text-gray-800">
              {com.subdivision?.nom || "Aucune Communes"}
            </td>
            <td className="px-4 py-3 text-center">
              <div className="flex items-center justify-center gap-4">
                {id === com.id ? (
                  <button
                    onClick={() => handleUpdate(com.id)}
                    className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 text-sm"
                  >
                    Valider
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(com)}
                     className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(com.id)}
                      className="text-red-600 hover:text-blue-800"
                    >
                      <FaTrash />
                    </button>
                  </>
                )}
              </div>
            </td>
          </tr>
        ))}
        {communes.length === 0 && (
          <tr>
            <td colSpan={4} align="center" className="py-4 text-gray-500 text-sm">
              Aucune communes trouvée.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div></div>
                                <Snackbar open={openSuccess} autoHideDuration={4000} onClose={()=>setOpenSuccess(false)}>
                                  <Alert onClose={()=>setOpenSuccess(false)} severity="success" sx={{ width: "100%" }}>
                                    {successMessage}
                                  </Alert>
                                </Snackbar>
                    
                                  <Snackbar open={openError} autoHideDuration={4000} onClose={() => setOpenError(false)}>
                                    <Alert onClose={() => setOpenError(false)} severity="error" sx={{ width: "100%" }}>
                                      {errorMessage}
                                    </Alert>
                                  </Snackbar>
  </div>
);

  
};

export default Commune;