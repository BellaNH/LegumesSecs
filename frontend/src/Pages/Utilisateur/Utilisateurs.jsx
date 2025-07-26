import React, { useEffect, useState, useContext } from "react";
import { FaTrashAlt } from "react-icons/fa";
import axios from "axios";
import { useGlobalContext } from "../../context";
import { useNavigate } from "react-router-dom";
import {Snackbar, Alert } from "@mui/material";
import User from "../pics/User.png"
import { FaTrash, FaEdit } from 'react-icons/fa';


  const SupprimerUtilisateur = ({ drawerWidth = 100 }) => {
  const [users, setUsers] = useState([]);
  const {url,user } = useGlobalContext();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(""); 
  const [successMessage, setSuccessMessage] = useState(""); 
  const [openError, setOpenError] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]); 


useEffect(() => {
  fetchUsers();
}, []);

const fetchUsers = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${url}/api/user/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setUsers(
      response.data && response.data.filter((user) => user.role.nom !== "admin")
    );
  } catch (error) {
    console.error("Erreur lors du chargement des utilisateurs :", error);
  }
};

const handleDelete = async (userId) => {
  const token = localStorage.getItem("token");
  if(userId){
  try {
    const res = await axios.delete(`${url}/api/user/${userId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Deleted user, status:", res.status);
    setSuccessMessage(`Utilisateur est supprimé avec succès ✅`);
    setOpenSuccess(true);
    fetchUsers(); 
  } catch (error) {
    setErrorMessage("Erreur d'enregistrement.");
    setOpenError(true);
  }
}
};



 useEffect(()=>{console.log(users)},[users])

  const handleEditClick = (user) => {
    navigate(`/modifier-utilisateur/${user.id}`);
  };

  const filteredUsers = user
  ? users.filter((u) => u.email !== user.email)
  : users;


  const usersByRole = filteredUsers.reduce((acc, user) => {
    const role = user.role.nom;
    if (!acc[role]) acc[role] = [];
    acc[role].push(user);
    return acc;
  }, {});

  return (
 <div className="w-[80%] h-fit mt-10 mx-auto flex flex-col items-center">
  <div className="w-[80%] flex flex-col mb-16">
   <div className='flex align-center gap-4'> 
            <img src={User} className="w-8 h-8 mt-1" />
            <h2 className="text-3xl font-bold text-left text-green-600 mb-6">
             Liste d'utilisateurs
           </h2>
    </div>


  {Object.keys(usersByRole).map((role) => (
    <div
      key={role}
      style={{
        backgroundColor: "#f4faf7",
        border: "1px solid #d6e9d9",
        borderRadius: "14px",
        padding: "24px",
        marginBottom: "30px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.03)",
      }}
    >
      <h3
        style={{
          textAlign: "center",
          fontSize: "20px",
          fontWeight: "600",
          color: "#2e7d32",
          marginBottom: "16px",
        }}
      >
        {role}
      </h3>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <thead className="bg-green-600 text-white">
          <tr>
            <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, width: "30%" }}>
              Nom
            </th>
            <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, width: "45%" }}>
              Email
            </th>
            <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: 600, width: "25%" }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {usersByRole[role].map((user, index) => (
            <tr
              key={user.id}
              style={{
                backgroundColor: index % 2 === 0 ? "#ffffff" : "#f9f9f9",
                borderBottom: "1px solid #e0e0e0",
              }}
            >
              <td style={{ padding: "12px 16px", color: "#333" }}>{user.nom}</td>
              <td style={{ padding: "12px 16px", color: "#333", wordBreak: "break-word" }}>{user.email}</td>
              <td style={{ padding: "12px 16px", textAlign: "center" }}>
               <button
                                       onClick={() => handleEditClick(user)}
                                       className="text-blue-600 hover:text-blue-800 mr-4 text-[18px]"
                                     >
                                       <FaEdit />
                                     </button>
                                     <button
                                       onClick={() => handleDelete(user.id)}
                                       className="text-red-600 hover:text-red-800 text-[18px]"
                                     >
                                       <FaTrash />
                                     </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ))}
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
</div>
  );
};

const thStyle = {
  padding: "12px",
  textAlign: "left",
  backgroundColor: "#1A237E", 
  color: "#FFFFFF",       
  fontWeight: "bold",
  borderBottom: "2px solid #ccc",
};


const tdStyle = {
  padding: "10px",
  borderBottom: "1px solid #ddd",
  color: "#333",
  fontSize: "0.95rem",
};

export default SupprimerUtilisateur;