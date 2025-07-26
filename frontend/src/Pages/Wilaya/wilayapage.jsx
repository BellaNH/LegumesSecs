import React, { useEffect, useState } from 'react'; 
import axios from 'axios';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { useGlobalContext } from '../../context';
import { Snackbar, Alert } from "@mui/material";
import Localisation from "../pics/Localisation.png"
const WilayasPage = () => {
  const [newWilaya, setNewWilaya] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [errorMessage, setErrorMessage] = useState(""); 
  const [successMessage, setSuccessMessage] = useState(""); 
  const [openError, setOpenError] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const {user,fetchWilaya,wilayas,setWilayas,url} = useGlobalContext()
  

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    console.log(token) 
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };
  const addWilaya = async (newWilaya) => {
    if (!newWilaya) return;
    try {
      const response = await axios.post(`${url}/api/wilaya/`,
        { nom: newWilaya },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      setSuccessMessage(`Wilaya est ajoutée avec succès ✅`);
      setOpenSuccess(true);
      fetchWilaya()
    } catch (error) {
      setErrorMessage("Erreur lors de l’ajout d'une wilaya");
      setOpenError(true);
    }
  };
  
  const handleAdd= (e)=>{
    e.preventDefault()
    addWilaya(newWilaya)
    setNewWilaya('')
  }


  
  useEffect(()=>console.log(`${url}/wilaya/`),[])
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:8000/api/wilaya/${id}/`, getAuthHeader());
        setWilayas(wilayas.filter((wilaya) => wilaya.id !== id));
        setSuccessMessage(`Wilaya est supprimée avec succès ✅`);
        setOpenSuccess(true);

    } catch (error) {
      setErrorMessage("Erreur lors de la suppression.");
      setOpenError(true);
    }
  };  
  
  const handleEdit = (wilaya) => {
    setEditingId(wilaya.id);
    setEditingName(wilaya.nom);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `${url}/api/wilaya/${editingId}/`,
        { nom: editingName },
        getAuthHeader()
      );
      setSuccessMessage(`Wilaya est modifiée avec succès ✅`);
      setOpenSuccess(true);
      setEditingId(null);
      setEditingName('');
      fetchWilaya()
    } catch (error) {
       setErrorMessage("Erreur lors de la mise à jour");
      setOpenError(true);
    }
  };

  return (
  <div className="w-[80%] h-fit mt-10 mx-auto flex flex-col items-center">
  <div className="w-[80%] mb-16 flex flex-col">
    <div className='flex align-center gap-2'> 
      <img src={Localisation} alt="localisation" className='w-10 h-10'/>
      <h2 className="text-3xl font-bold text-left text-green-600 mb-6">
       wilayas
     </h2>
    </div>
    

    <div className="flex gap-4 mb-8">
      <input
        type="text"
        placeholder="Nouvelle wilaya"
        value={newWilaya}
        onChange={(e) => setNewWilaya(e.target.value)}
        className="flex-1 border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-[16px]"
      />
      <button
        onClick={(e) => handleAdd(e)}
        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg text-[16px]"
      >
        Ajouter
      </button>
    </div>

    {wilayas.length === 0 ? (
      <p className="text-center text-gray-500 text-[18px] italic">
        Aucune wilaya disponible.
      </p>
    ) : (
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-green-600">
            <tr>
              <th className="px-4 py-3 text-left text-white text-[18px] font-medium">
                Nom
              </th>
              {(user.role.nom === "admin" ||
                user.permissions.find(
                  (p) => p.model === "Wilaya" && (p.update || p.delete) === "true"
                )) && (
                <th className="px-4 py-3 text-right text-white text-[18px] font-medium">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {wilayas.map((wilaya) => (
              <tr
                key={wilaya.id}
                className="even:bg-gray-50 hover:bg-green-50 transition duration-200"
              >
                <td className="px-4 py-3 text-[16px] text-gray-800">
                  {editingId === wilaya.id ? (
                    <input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-1 text-[15px]"
                    />
                  ) : (
                    wilaya.nom
                  )}
                </td>
                {(user.role.nom === "admin" ||
                  user.permissions.find(
                    (p) => p.model === "Wilaya" && (p.update || p.delete) === "true"
                  )) && (
                  <td className="px-4 py-3 text-right text-[16px] text-gray-700">
                    {editingId === wilaya.id ? (
                      <button
                        onClick={handleUpdate}
                        className="bg-blue-600 text-white px-4 py-1 rounded-lg hover:bg-blue-700"
                      >
                        Valider
                      </button>
                    ) : (
                      <>
                        {(user.role.nom === "admin" ||
                          user.permissions.find(
                            (p) => p.model === "Wilaya" && p.update === "true"
                          )) && (
                          <button
                            onClick={() => handleEdit(wilaya)}
                            className="text-blue-600 hover:text-blue-800 mr-4 text-[18px]"
                          >
                            <FaEdit />
                          </button>
                        )}
                        {(user.role.nom === "admin" ||
                          user.permissions.find(
                            (p) => p.model === "Wilaya" && p.delete === "true"
                          )) && (
                          <button
                            onClick={() => handleDelete(wilaya.id)}
                            className="text-red-600 hover:text-red-800 text-[18px]"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
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

export default WilayasPage;
