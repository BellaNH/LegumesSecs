import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, MenuItem, Container, Paper, Snackbar, Alert } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../context";
import Checkbox from '@mui/material/Checkbox';
import Slider from './PermissionSlider/Slider'
const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
const AjouterUtilisateur = () => {
  const [userId,setUserId] = useState("")
  const [addedUser,setAddedUser] = useState("")
  const modelNames = ["Agriculteur","Espece","Commune","Exploitation","Objectif",
   "Parcelle","Subdivision","Utilisateur","Wilaya"];
   
  const initialPermissions = ()=> modelNames.map((model)=>(
    {
        model:model,
        create:false,
        retrieve:false,
        update:false,
        destroy:false
  }

  ))
  const [formData, setFormData] = useState({
    nom: "",
    prenom:"",
    email: "",
    phoneNum:"",
    password: "",
    role_id: "",
    permissions:initialPermissions()
  });
 
  const [selectedWilaya, setSelectedWilaya] = useState('');
  const [selectedSubdivision, setSelectedSubdivision] = useState('');
  const [selectedRole, setSelectedRole] = useState('')
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Ajout d'un état pour les erreurs
  const navigate = useNavigate();
  const [showPermissionForm, setShowPermissionForm] = useState(false);
  const {subdivisions,wilayas,user,roles,url} = useGlobalContext()

  

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

const handleChange = (e, modelName = null) => {
  const { name, type, checked, value, dataset } = e.target;
  console.log(dataset)
  if (modelName) {
    setFormData((prevData) => {
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
   if (name === "role_id") {
  const selected = roles.find((r) => r.id === value);
  setSelectedRole(selected?.nom || "");
}

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }
};
useEffect(()=>{console.log(selectedRole),[selectedRole]})

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response =  await axios.post(`${url}/api/user/`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });
       console.log(response.data)
      setUserId(response.data.id)
      setAddedUser(response.data)
      setSuccessMessage(`${formData.nom} est bien enregistré ✅`);
      setOpenSnackbar(true);
      setErrorMessage("");

    } catch (error) {
      setErrorMessage(error.response?.data?.detail || "Erreur d'enregistrement ❌");
    }
  }
const handleUserLocation = async (e) => {
  e.preventDefault();

  if (!addedUser) return;

  try {

    if (selectedWilaya) {
      const responseWilaya = await axios.post(`${url}/api/userWilaya/`, 
        {
          user: userId,
          wilaya: selectedWilaya,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Wilaya response:", responseWilaya.data);
    }

    if (selectedSubdivision) {
      const responseSubdiv = await axios.post(`${url}/api/userSubdiv/`, 
        {
          user: userId,
          subdivision: selectedSubdivision,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Subdivision response:", responseSubdiv.data);
    }

    
    setSuccessMessage(`${formData.nom} est bien enregistré `);
    setOpenSnackbar(true);
    setErrorMessage("");
    navigate("/utilisateurs");

  } catch (error) {
    console.error("Error during location assignment:", error);
    setErrorMessage(error.response?.data?.detail || "Erreur d'enregistrement ❌");
  }
};

useEffect(()=>{console.log(selectedSubdivision)},[selectedSubdivision])
  
  useEffect(()=>{console.log(formData)},[formData])
  return (
    <div  className={`relative w-[70%] h-[100%] mx-auto `}>
      <Paper  elevation={1} sx={{ padding: 2, marginTop: 1,zIndex:0}}>
        <Typography variant="h6" sx={{ marginBottom: 2, fontWeight: "bold" }}>
          Ajouter un utilisateur
        </Typography>
        <Box component="form" onSubmit={addedUser? handleUserLocation : handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <div className="flex gap-4">
          <TextField size="small" label="Nom" name="nom" fullWidth required onChange={(e)=>handleChange(e)} />
          <TextField size="small" label="Prenom" name="prenom" fullWidth required onChange={(e)=>handleChange(e)} />
          </div>
          <TextField size="small" label="Email" name="email" type="email" fullWidth required onChange={(e)=>handleChange(e)} />
          
          <TextField size="small" label="Mot de passe" name="password" type="password" fullWidth required onChange={(e)=>handleChange(e)} />
          <div className="flex gap-4">
          <TextField size="small" label="Num de tel" name="phoneNum" type="integer" fullWidth required onChange={(e)=>handleChange(e)} />
          <TextField
            select
            label="Rôle"
            name="role_id"
            value={formData.role_id || ""} 
            onChange={(e)=>handleChange(e)}
            fullWidth
            required
            size="small"
          >
            
            {roles && roles.filter(role=>role.nom !=="admin").map((role,index)=>(
              <MenuItem value={role.id} key={index}>{role.nom}</MenuItem>
            ))}

          </TextField>
          </div>

           
          {addedUser && addedUser.role.nom === "agent_dsa"  && (
            <TextField
              size="small"
              select
              label="Wilaya"
              fullWidth
              required
              value={selectedWilaya}
              onChange={(e) => setSelectedWilaya(e.target.value)}
            >
              {wilayas.map((w) => (
                <MenuItem key={w.id} value={w.id}>
                  {w.nom}
                </MenuItem>
              ))}
            </TextField>
          )}
          <div className="flex gap-4">
 
          {addedUser && addedUser.role.nom === "agent_subdivision" && (
            <TextField
              size="small"
              select
              label="Subdivision"
              fullWidth
              required
              value={selectedSubdivision}
              onChange={(e) => setSelectedSubdivision(e.target.value)}
            >
              {subdivisions.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.nom}
                </MenuItem>
              ))}
            </TextField>
          )}
          {/* Subdivision */}
          
          <button type="button" className="bg-green-50 w-[50%]" 
          onClick={()=>setShowPermissionForm(true)}>Permissions</button>
          
          </div>
          {showPermissionForm && 
          <div className="fixed top-0 left-0 w-full h-full bg-[#00000090] z-50 flex justify-center items-center">
          <Slider 
          permissions={formData.permissions}
          resetPermissions={() => initialPermissions()}
          modelNames={modelNames}
          setShowPermissionForm={setShowPermissionForm} 
          showPermissionForm={showPermissionForm}
          handleChange={handleChange}
          formData={formData}
          setFormData={setFormData}
          onCancel={() => {
          setFormData(prev => ({
          ...prev,
          permissions: initialPermissions(), 
          }));
          }}
          />
          </div>
          
          }
          {addedUser?
          <button className="ml-[75%] h-8 top-16 w-40 px-8 text-sm bg-blue-700 text-white rounded-md"
           type="submit"  color="primary" >
          Ajouter
          </button>:
          <button className="ml-[75%] h-8 top-16 w-40 px-8 text-sm bg-blue-700 text-white rounded-md"
           type="submit"  color="primary" >
          Confirmer
          </button>}
     
          
          
        </Box>
      </Paper>

      {/* Snackbar pour afficher le message de succès */}
      <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Affichage des erreurs */}
      {errorMessage && (
        <Snackbar open={true} autoHideDuration={4000} onClose={() => setErrorMessage("")}>
          <Alert onClose={() => setErrorMessage("")} severity="error" sx={{ width: "100%" }}>
            {errorMessage}
          </Alert>
        </Snackbar>
      )}
  
    </div>
  );
};

export default AjouterUtilisateur;
