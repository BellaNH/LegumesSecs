import React, { useEffect, useState, useContext } from "react";
import { FaTrashAlt } from "react-icons/fa";
import axios from "axios";
import { useGlobalContext } from "../../context";
import { useNavigate } from "react-router-dom";

  const SupprimerUtilisateur = ({ drawerWidth = 100 }) => {
  const [users, setUsers] = useState([]);
  const {url,user } = useGlobalContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]); // ← ce bloc protège l’accès

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
      setUsers(response.data && response.data.filter(user=>user.role.nom !=="admin"))
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs :", error);
    }
  };
 useEffect(()=>{console.log(users)},[users])
  const handleDelete = async (userId) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) return;

    try {
      await axios.delete(`http://localhost:8000/api/user/${userId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur :", error);
    }
  };

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
    <div
      style={{
        margin: "30px auto",
        maxWidth: "1000px",
        padding: "30px",
        backgroundColor: "#fff",
        borderRadius: "12px",
        border: "1px solid #ccc",
        marginLeft: 200,
      }}
    >
      <h2 style={{ textAlign: "center", color: "#2c3e50", marginBottom: "30px" }}>
        👥 Listes des employés
      </h2>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "30px", justifyContent: "center" }}>
        {Object.keys(usersByRole).map((role) => (
          <div
            key={role}
            style={{
              width: "100%",
              maxWidth: "650px",
              border: "1px solid #ddd",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "1 2px 10px rgba(225, 28, 176, 0.1)",
              backgroundColor: "#f9f9f9",
            }}
          >
            <h3 style={{ textAlign: "center", color: "#333", marginBottom: "20px" }}>{role}</h3>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
              <tr>
               <th style={{ ...thStyle, width: "1%", textAlign: "left" }}>Nom</th>
               <th style={{ ...thStyle, width: "45%", textAlign: "center" }}>Email</th>
               <th style={{ ...thStyle, width: "20%", textAlign: "center" }}>Actions</th>
              </tr>

              </thead>
              <tbody>
                {usersByRole[role].map((user) => (
                  <tr key={user.id} style={{ borderBottom: "1px solid #ccc" }}>
                    <td style={tdStyle}>{user.nom}</td>
                    <td style={tdStyle}>{user.email}</td>
                    <td style={{ ...tdStyle, textAlign: "center" }}>
                      <button
                        onClick={() => handleEditClick(user)}
                        style={{ marginRight: "8px", cursor: "pointer" }}
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        style={{ cursor: "pointer" }}
                      >
                        <FaTrashAlt style={{ color: "red", fontSize: "15px" }} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

const thStyle = {
  borderBottom: "2px solid #999",
  padding: "10px",
  textAlign: "left",
  backgroundColor: "#eaeaea",
};

const tdStyle = {
  padding: "10px",
  borderBottom: "1px solid #ddd",
};

export default SupprimerUtilisateur;