// ModifierUtilisateur.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useGlobalContext } from "../../context";
import { Box, TextField, Button, Typography, MenuItem, Container, Paper, Snackbar, Alert } from "@mui/material";
import Slider from './PermissionSlider/Slider'
const ModifierUtilisateur = () => {
  const modelNames = ["Agriculteur","Espece","Commune","Exploitation","Objectif",
     "Parcelle","Subdivision","Utilisateur","Wilaya"];


  const [showPermissionForm, setShowPermissionForm] = useState(false);
  const { id } = useParams();
  const [initialPerm,setInitialPerm] = useState([])
  const navigate = useNavigate();
  const [user, setUser] = useState({
  email: "",
  role_id: "",
  permissions: [], // <- default empty permissions
});
 const {url,wilayas,subdivisions,roles} = useGlobalContext()
 const [selectedRole, setSelectedRole] = useState('')
 const [selectedRoleName, setSelectedRoleName] = useState('')
 const [location, setLocation] = useState('')


 useEffect(() => {
  const token = localStorage.getItem("token");

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${url}/api/user/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res.data);
      setInitialPerm(res.data.permissions);
      setUser({
        ...res.data,
        email: res.data.email,
        role: res.data.role,
        permissions: res.data.permissions,
      });
      setSelectedRole(res.data.role.id)
      setSelectedRoleName(res.data.role.nom)
      if (res.data.role.nom === "agent_dsa") {
        const locationRes = await axios.get(`${url}/api/userWilaya/by-user/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(locationRes.data)
       setLocation(locationRes.data.wilaya); 
      } else if (res.data.role.nom === "agent_subdivision") {
        const locationRes = await axios.get(`${url}/api/userSubdiv/by-user/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(locationRes.data)
        setLocation(locationRes.data.subdivision); 
      }
    } catch (err) {
      console.error("Erreur lors du chargement de l'utilisateur :", err);
    }
  };

  fetchUser();
}, [id]);

  
  const handleChange = (e, modelName = null) => {
  const { name, type, checked, value } = e.target;

  if (modelName) {
    setUser((prevData) => {
      const updatedPermissions = prevData.permissions.map((perm) =>
        perm.model === modelName
          ? { ...perm, [name]: type === "checkbox" ? checked : value }
          : perm
      );

      return {
        ...prevData,
        permissions: updatedPermissions,
      };
    });
  } else {
    if(name ==="role_id"){
       const selectedRoleObject = roles.find((role) => role.id === parseInt(value))
      setSelectedRoleName(selectedRoleObject?.nom || "");
      setSelectedRole(value)
    }
    setUser((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem("token");

  try {
    // 1. Update the user
    const res = await axios.patch(`http://localhost:8000/api/user/${id}/`, user, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setUser({
        ...res.data,
        email: res.data.email,
        role: res.data.role,
        permissions: res.data.permissions,
      });
    if(res.data.role.nom==="agent_dsa"){
      try{
      const res = await axios.patch(`http://localhost:8000/api/userWilaya/by-user/${id}/`, 
        {wilaya:location}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  console.log(res)
  }catch(error){
      console.log(error)
    }

    }
   if(res.data.role.nom==="agent_subdivision"){
      try{
      const res = await axios.patch(`http://localhost:8000/api/userSubdiv/by-user/${id}/`, 
        {subdivision:location}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  console.log(res)
  }catch(error){
      console.log(error)
    }

    }

    navigate("/utilisateurs");

  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
  }
};



  const handleCancel = () => {
    navigate("/utilisateurs");
  };
 useEffect(()=>{console.log(user)},[])
 useEffect(()=>{console.log(location)},[location])
 useEffect(()=>{console.log(subdivisions)},[subdivisions])
 useEffect(()=>{console.log(selectedRole)},[selectedRole])
  return (
    <div style={{ padding: "60px", display: "flex", justifyContent: "center",position:"relative" }}>
      <div style={{
        background: "#f9f9f9",
        border: "1px solid #ddd",
        borderRadius: "12px",
        padding: "40px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        width: "100%",
        maxWidth: "500px"
      }}>
        <h2 style={{ textAlign: "center", marginBottom: "30px" }}>✏️ Modifier les informations de l'utilisateur</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
  
                    <TextField value={user?user.email:""} size="small" label="Email" name="email" type="email" fullWidth required onChange={(e)=>handleChange(e)} />
                    <div className="flex gap-4">
                    
                    <TextField
                      select
                      label="Rôle"
                      name="role_id"
                      value={selectedRole || ""}
                      onChange={(e)=>(handleChange(e))}
                      fullWidth
                      required
                      size="small"
                    >
                      
                      {roles && roles.filter(role=>role.nom !=="admin").map((role,index)=>(
                        <MenuItem value={role.id} key={index}>{role.nom}</MenuItem>
                      ))}
          
                    </TextField>
                    </div>
          
                    
                    <div className="flex gap-4">
                 
                  {selectedRoleName && selectedRoleName === "agent_dsa"  && 
    <TextField
      select
      label="Wilaya"
      name="wilaya"
      value={location || ""}
      onChange={(e) => setLocation(e.target.value)}
      fullWidth
      required
      size="small"
    >
      {wilayas.map((item, index) => (
        <MenuItem key={index} value={item.id}>
          {item.nom}
        </MenuItem>
      ))}
    </TextField>
}
  {selectedRoleName && selectedRoleName === "agent_subdivision"  && 
    <TextField
      select
      label="Subdivision"
      name="subdivision"
      value={location || ""}
      onChange={(e) => setLocation(e.target.value)}
      fullWidth
      required
      size="small"
    >
      {subdivisions.map((item, index) => (
        <MenuItem key={index} value={item.id}>
          {item.nom}
        </MenuItem>
      ))}
    </TextField>
}
                    
                    <button type="button" className="bg-green-50 w-[100%]" onClick={()=>setShowPermissionForm(true)}>Permissions</button>
                    </div>
                    
                    {showPermissionForm && 
          <div className="fixed top-0 left-0 w-full h-full bg-[#00000090] z-50 flex justify-center items-center">

          <Slider 
          initialPermissions={user.permissions}
          resetPermissions={() => modelNames.map(model => ({
          model,
          create: false,
          retrieve: false,
          update: false,
          destroy: false,
          }))}
          modelNames={modelNames}
          setShowPermissionForm={setShowPermissionForm} 
          showPermissionForm={showPermissionForm}
          handleChange={handleChange}
          formData={user}
          setFormData={setUser}
          onCancel={() => {
          setUser(prev => ({
          ...prev,
          permissions: initialPerm, 
          }));
          }}
          />
          </div>
          
          }
          
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button
              type="submit"
              style={{
                padding: "10px 20px",
                backgroundColor: "#4CAF50",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              ✅ Mettre à jour
            </button>
            <button
              type="button"
              onClick={handleCancel}
              style={{
                padding: "10px 20px",
                backgroundColor: "#f44336",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              ❌ Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModifierUtilisateur;
