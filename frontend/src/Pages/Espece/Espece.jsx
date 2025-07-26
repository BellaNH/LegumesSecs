import React, { useEffect, useState } from 'react'; 
import axios from 'axios';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { useGlobalContext } from '../../context';
import  { Snackbar, Alert} from "@mui/material";
import Lentilles from "../pics/Lentilles.png"
const Espece = () => {
  const [newEspece, setNewEspece] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [errorMessage, setErrorMessage] = useState(""); 
  const [successMessage, setSuccessMessage] = useState(""); 
  const [openError, setOpenError] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
    
  const {especes, setEspeces,url,fetchEspeces} = useGlobalContext()

  const handleAdd = async () => {
    console.log(newEspece)
    if (!newEspece) return;
     newEspece.trim().toLowerCase();
    try {
      const response = await axios.post(`${url}/api/espece/`,
        { nom: newEspece },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response.data)
      setSuccessMessage(`Espece ajouté avec succès ✅`);
      setOpenSuccess(true);
      setNewEspece('');
      fetchEspeces()
    } catch (error) {
      setErrorMessage("Erreur lors de l’ajout d'un espece");
      setOpenError(true);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${url}/api/espece/${id}/`,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setSuccessMessage(`Espece supprimé avec succès ✅`);
      setOpenSuccess(true);
      setEspeces(especes.filter((wilaya) => wilaya.id !== id));
    } catch (error) {
      setErrorMessage("Erreur lors de la suppression d'espece");
      setOpenError(true);
    }
  };  
  
  const handleEdit = (espece) => {
    setEditingId(espece.id);
    setEditingName(espece.nom);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `${url}/api/espece/${editingId}/`,
        { nom: editingName },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSuccessMessage(`Espece modifié avec succès ✅`);
      setOpenSuccess(true);
      setEditingId(null);
      setEditingName('');
      fetchEspeces()
    } catch (error) {
      setErrorMessage("Erreur lors de la mise à jour");
      setOpenError(true);
    }
  };

  return (
  <div className="w-[80%] h-fit mt-10 mx-auto flex flex-col items-center">
  <div className="w-[80%] flex flex-col ">
    <div className='flex  gap-4'> 
                    <img src={Lentilles} className="w-16 h-16" />
                    <h2 className="text-3xl font-bold text-left text-green-600 mb-6 mt-2">
                     Espece
                   </h2>
            </div>

    <div className="flex items-center justify-center gap-4 mb-6">
      <input
        type="text"
        placeholder="Nouveau Espece"
        value={newEspece}
        onChange={(e) => setNewEspece(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
      />
      <button
        onClick={handleAdd}
        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-md text-sm"
      >
        Ajouter
      </button>
    </div>

    <div className="bg-white shadow-md rounded-xl overflow-hidden">
      <table className="min-w-full table-auto text-left border border-gray-200">
        <thead className="bg-green-600 text-white">
          <tr>
            <th className="px-4 py-3 text-sm font-semibold">Nom</th>
            <th className="px-4 py-3 text-sm font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {especes.map((espece) => (
            <tr key={espece.id} className="even:bg-gray-50 hover:bg-green-50 transition duration-200">
              <td className="px-4 py-3 text-[16px] text-gray-800">
                {editingId === espece.id ? (
                  <input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-1 text-sm"
                  />
                ) : (
                  espece.nom
                )}
              </td>
              <td className="px-4 py-3 text-right">
                {editingId === espece.id ? (
                  <button
                    onClick={handleUpdate}
                    className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 text-sm"
                  >
                    Valider
                  </button>
                ) : (
                  <div className="flex justify-end items-center gap-4 text-[18px]">
                    <button
                      onClick={() => handleEdit(espece)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(espece.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
          {especes.length === 0 && (
            <tr>
              <td colSpan={2} className="text-center py-4 text-gray-500 italic">
                Aucun Espece disponible.
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

export default Espece;