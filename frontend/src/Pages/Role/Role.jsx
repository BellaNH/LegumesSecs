import React, { useEffect, useState } from 'react'; 
import axios from 'axios';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { useGlobalContext } from '../../context';
import {Snackbar, Alert } from "@mui/material";
import User from "../pics/User.png"
const Role = () => {
  const [newRole, setNewRole] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
     const [errorMessage, setErrorMessage] = useState(""); 
    const [successMessage, setSuccessMessage] = useState(""); 
    const [openError, setOpenError] = useState(false);
    const [openSuccess, setOpenSuccess] = useState(false);
  const {roles, setRoles,url,fetchRoles} = useGlobalContext()

  const handleAdd = async () => {
    console.log(newRole)
    if (!newRole) return;
     newRole.trim().toLowerCase();
    try {
      const response = await axios.post(`${url}/api/role/`,
        { nom: newRole },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response.data)
      setSuccessMessage(`Role ajouté avec succès ✅`);
      setOpenSuccess(true);
      setNewRole('');
      fetchRoles()
    } catch (error) {
      setErrorMessage("Erreur d'enregistrement.");
      setOpenError(true);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${url}/api/role/${id}/`,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setSuccessMessage(`Role supprimé avec succès ✅`);
      setOpenSuccess(true);
  fetchRoles()
    } catch (error) {
      setErrorMessage("Erreur lors de la suppression");
      setOpenError(true);
    }
  };  
  
  const handleEdit = (role) => {
    setEditingId(role.id);
    setEditingName(role.nom);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `${url}/api/role/${editingId}/`,
        { nom: editingName },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSuccessMessage(`Role modifié avec succès ✅`);
      setOpenSuccess(true);
      setEditingId(null);
      setEditingName('');
      fetchRoles()
    } catch (error) {
      setErrorMessage("Erreur lors de la modification");
      setOpenError(true);
    }
  };

  return (
  <div className="w-[100%] h-fit mt-10 mx-auto flex flex-col items-center">
  <div className="w-[85%] flex flex-col ">
       <div className='flex align-center gap-4'> 
                <img src={User} className="w-8 h-8 mt-1" />
                <h2 className="text-3xl font-bold text-left text-green-600 mb-6">
                 Role
               </h2>
        </div>

    <div className="flex gap-4 mb-8">
      <input
        type="text"
        placeholder="Nouveau rôle"
        value={newRole}
        onChange={(e) => setNewRole(e.target.value)}
        className="flex-1 border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700 text-[16px]"
      />
      <button
        onClick={handleAdd}
        className="bg-green-600 hover:bg-green-800 text-white font-semibold px-6 py-3 rounded-lg text-[16px]"
      >
        Ajouter
      </button>
    </div>

    {roles.length === 0 ? (
      <p className="text-center text-gray-500 text-[18px] italic">
        Aucun rôle disponible.
      </p>
    ) : (
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-green-600">
            <tr>
              <th className="px-4 py-3 text-left text-white text-[18px] font-medium">
                Nom
              </th>
              <th className="px-4 py-3 text-right text-white text-[18px] font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr
                key={role.id}
                className="even:bg-gray-50 hover:bg-green-50 transition duration-200"
              >
                <td className="px-4 py-3 text-[16px] text-gray-800">
                  {editingId === role.id ? (
                    <input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-1 text-[15px]"
                    />
                  ) : (
                    role.nom
                  )}
                </td>
                <td className="px-4 py-3 text-right text-[16px] text-gray-700">
                  {editingId === role.id ? (
                    <button
                      onClick={handleUpdate}
                      className="bg-blue-600 text-white px-4 py-1 rounded-lg hover:bg-blue-700"
                    >
                      Valider
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(role)}
                        className="text-blue-600 hover:text-blue-800 mr-4 text-[18px]"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(role.id)}
                        className="text-red-600 hover:text-red-800 text-[18px]"
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
                </td>
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

export default Role;