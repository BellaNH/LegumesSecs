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
  TextField
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import SearchIcon from '@mui/icons-material/Search'; 
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { useGlobalContext } from "../../context";
import { FaTrash, FaEdit } from 'react-icons/fa';
import InputAdornment from '@mui/material/InputAdornment';
import {Snackbar, Alert } from "@mui/material";
import Localisation from "../pics/Localisation.png"

const SubdivisionManager = () => {

  const {url,user} = useGlobalContext()
  const navigate = useNavigate();
  const [subdivisions,setSubdivisions ] = useState([])
  const [editingId, setEditingId] = useState(null);
  const [editedSubdivName, setEditedSubdivName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
     const [errorMessage, setErrorMessage] = useState(""); 
    const [successMessage, setSuccessMessage] = useState(""); 
    const [openError, setOpenError] = useState(false);
    const [openSuccess, setOpenSuccess] = useState(false);



const fetchSubdivisions = async () => {
  try {
    const res = await axios.get(`${url}/api/subdivision/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const list = Array.isArray(res.data) ? res.data : (res.data?.results ?? []);
    setSubdivisions(list);
  } catch (error) {
    console.error("Erreur de chargement des subdivisions", error);
  }
};

useEffect(() => {
  fetchSubdivisions();
}, []);

const filteredSubdivisions = (Array.isArray(subdivisions) ? subdivisions : []).filter(sub =>
  sub.nom?.toLowerCase().includes(searchQuery.toLowerCase())
);
  const [subdiv,setSubdiv] = useState({})
  const handleChange = (e)=>{
    const {name,value} = e.target
    setSubdiv({
      ...subdiv,
      [name]:value
    })
  }
  const handleEdit = (subdivision) => {
    setEditingId(subdivision.id);
    setEditedSubdivName(subdivision.nom);
  };
  const handleUpdate = async (id) => {
    console.log(id)
    if(id){
      try {
        await axios.put(
          `${url}/api/subdivision/${editingId}/`,
          { nom: editedSubdivName,
            wilaya_id:id,
           },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setSuccessMessage(`Subdivision est modifiée avec succès ✅`);
        setOpenSuccess(true);
        setEditingId(null);
        setEditedSubdivName('');
        fetchSubdivisions()
      } catch (error) {
        setErrorMessage("Erreur lors de la mise à jour");
        setOpenError(true);
      }
    }
    }
  const handleDelete = async (id) => {
    try{
      await axios.delete(`${url}/api/subdivision/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setSuccessMessage(`Subdivision est supprimée avec succès ✅`);
      setOpenSuccess(true);
      fetchSubdivisions()
      setSubdivisions((prev) => prev.filter((s) => s.id !== id))
    }catch(error){
      setErrorMessage("Erreur lors de suppression");
      setOpenError(true);
    }
    
  };

return (
<div className="w-[100%] h-fit mt-10 mx-auto flex flex-col items-center">
  <div className="w-[85%] flex flex-col mb-16">
    <div className='flex align-center gap-2'> 
          <img src={Localisation} alt="localisation" className='w-10 h-10'/>
          <h2 className="text-3xl font-bold text-left text-green-600 mb-6">
           Subdivisions
         </h2>
        </div>

    <div className="flex items-center justify-center gap-4 mb-6">
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Rechercher une subdivision"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md pl-10 focus:outline-none focus:ring-2 focus:ring-green-600"
        />
        <div className="absolute left-3 top-2.5 text-gray-400">
          <SearchIcon />
        </div>
      </div>

      <button
        onClick={() => navigate("/ajouter-subdivision")}
        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-md text-sm"
      >
        Ajouter
      </button>
    </div>

    <div className="bg-white shadow-md rounded-xl overflow-hidden">
      <table className="min-w-full table-auto text-left border border-gray-200">
        <thead className="bg-green-600 text-white">
          <tr>
            <th className="px-4 py-3 text-sm font-semibold">ID</th>
            <th className="px-4 py-3 text-sm font-semibold">Nom de la subdivision</th>
            <th className="px-4 py-3 text-sm font-semibold">Wilaya</th>
            <th className="px-4 py-3 text-sm font-semibold text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredSubdivisions.map((sub) => (
            <tr key={sub.id} className="even:bg-gray-50 hover:bg-green-50 transition duration-200">
              <td className="px-4 py-3 text-sm">{sub.id}</td>

              <td className="px-4 py-3 text-[16px] text-gray-800">
                {editingId === sub.id ? (
                  <input
                    value={editedSubdivName}
                    onChange={(e) => setEditedSubdivName(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-1 text-sm"
                  />
                ) : (
                  sub.nom
                )}
              </td>

              <td className="px-4 py-3 text-[16px] text-gray-800">{sub.wilaya.nom}</td>

              <td className="px-4 py-3 text-center">
                {editingId === sub.id ? (
                  <button
                    onClick={(e) => handleUpdate(sub.wilaya.id)}
                    className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 text-sm"
                  >
                    Valider
                  </button>
                ) : (
                  <div className="flex justify-center items-center gap-4 text-[18px]">
                    <button
                      onClick={() => handleEdit(sub)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(sub.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}

          {subdivisions.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center py-4 text-gray-500 italic">
                Aucune subdivision trouvée.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>


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

export default SubdivisionManager;
