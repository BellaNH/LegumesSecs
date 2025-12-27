import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, MenuItem, Container, Paper, Snackbar, Alert } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../context";
import Checkbox from '@mui/material/Checkbox';
import Slider from './PermissionSlider/Slider'
import User from "../pics/User.png"

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
const AjouterUtilisateur = () => {
  const {subdivisions,wilayas,user,roles,url,
    setSliderStatus,setCurrentUserPermissions,defaultPermissions} = useGlobalContext()
  const [userId,setUserId] = useState("")
  const [addedUser,setAddedUser] = useState("")

  useEffect(()=>{setSliderStatus("create")},[])
  const [formData, setFormData] = useState({
    nom: "",
    prenom:"",
    email: "",
    phoneNum:"",
    password: "",
    role_id: "",
    permissions:"",
    wilaya:null,
    subdivision:null
  });


  const [selectedWilaya, setSelectedWilaya] = useState('');
  const [selectedSubdivision, setSelectedSubdivision] = useState('');
  const [selectedRole, setSelectedRole] = useState('')
  const [errorMessage, setErrorMessage] = useState(""); 
  const [successMessage, setSuccessMessage] = useState(""); 
  const [openError, setOpenError] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const navigate = useNavigate();
  const [showPermissionForm, setShowPermissionForm] = useState(false);
  

  

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

const handleChange = (e, modelName = null) => {
  const { name, type, value, dataset } = e.target;
  console.log(dataset)
  console.log(name,type,value, dataset)
   if (name === "role_id") {
  const selected = roles.find((r) => r.id === value);
  setSelectedRole(selected?.nom || "");
}
    
   if(name ==="wilaya"){
      setSelectedWilaya(value)
      setFormData((prev)=>({
        ...prev,
        ["subdivision"]:null
      }))
    }
    if(name ==="subdivision"){
      setSelectedSubdivision(value)
      setFormData((prev)=>({
        ...prev,
        ["wilaya"]:null
      }))
    }
   
   
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  
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
      setSuccessMessage(`${formData.nom} est ajouté avec succès ✅`);
      setOpenSuccess(true);
      console.log(response.data);
      setFormData(
        {
    nom: "",
    prenom:"",
    email: "",
    phoneNum:"",
    password: "",
    role_id: "",
    permissions:"",
    subdivision:""
  }
      )
      setCurrentUserPermissions(defaultPermissions)

    } catch (error) {
      setErrorMessage("Erreur d'enregistrement.");
      setOpenError(true);
    }
  }


useEffect(()=>{console.log(selectedSubdivision)},[selectedSubdivision])
  
  useEffect(()=>{console.log(formData)},[formData])
  return (
    <div className="relative w-[75%] h-[80vh] mx-auto">
  <Paper
    elevation={3}
    sx={{
      padding: "2.5rem",
      borderRadius: "1rem",
      marginTop: "1rem",
      minHeight: "65%",
      zIndex: 0,
      boxShadow: "0 6px 24px rgba(0,0,0,0.08)",
    }}
  >
   <div className='flex align-center gap-4'> 
                   <img src={User} className="w-8 h-8 mt-1" />
                   <h2 className="text-3xl font-bold text-left text-green-600 mb-6 mt-1">
                    Ajouter utilisateur
                  </h2>
           </div>

    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div className="flex gap-6">
        <TextField
          value={formData.nom}
          size="small"
          label="Nom"
          name="nom"
          fullWidth
          required
          onChange={(e) => handleChange(e)}
        />
        <TextField
          value={formData.prenom}
          size="small"
          label="Prénom"
          name="prenom"
          fullWidth
          required
          onChange={(e) => handleChange(e)}
        />
      </div>

      <TextField
        value={formData.email}
        size="small"
        label="Email"
        name="email"
        type="email"
        fullWidth
        required
        onChange={(e) => handleChange(e)}
      />

      <TextField
        value={formData.password}
        size="small"
        label="Mot de passe"
        name="password"
        type="password"
        fullWidth
        required
        onChange={(e) => handleChange(e)}
      />

      <div className="flex gap-6">
        <TextField
          value={formData.phoneNum}
          size="small"
          label="Num de téléphone"
          name="phoneNum"
          type="tel"
          fullWidth
          required
          onChange={(e) => handleChange(e)}
        />
        <TextField
          select
          label="Rôle"
          name="role_id"
          value={formData.role_id || ""}
          onChange={(e) => handleChange(e)}
          fullWidth
          required
          size="small"
          sx={{
            backgroundColor: "rgba(222, 255, 235, 0.5)",
            borderRadius: "6px",
          }}
        >
          {Array.isArray(roles) &&
            roles.filter((role) => role.nom !== "admin").map((role, index) => (
              <MenuItem value={role.id} key={index}>
                {role.nom}
              </MenuItem>
            ))}
        </TextField>
      </div>

      <div className="flex gap-6">
        <button
          type="button"
          onClick={() => setShowPermissionForm(true)}
          className="w-[50%] text-sm bg-[#E6F4EA] text-green-700 font-medium py-2.5 px-4 rounded-md shadow hover:bg-[#D0F0DD] transition-all duration-200"
        >
          Gérer les permissions
        </button>

        {formData.role_id === 3 && (
          <TextField
            name="wilaya"
            className="w-[50%]"
            size="small"
            select
            label="Wilaya"
            required
            value={selectedWilaya}
            onChange={(e) => handleChange(e)}
            sx={{
              backgroundColor: "rgba(222, 255, 235, 0.5)",
              borderRadius: "6px",
            }}
          >
            {Array.isArray(wilayas) && wilayas.map((w) => (
              <MenuItem key={w.id} value={w.id}>
                {w.nom}
              </MenuItem>
            ))}
          </TextField>
        )}

        {formData.role_id === 4 && (
          <TextField
            name="subdivision"
            className="w-[50%]"
            size="small"
            select
            label="Subdivision"
            required
            value={selectedSubdivision}
            onChange={(e) => handleChange(e)}
            sx={{
              backgroundColor: "rgba(222, 255, 235, 0.5)",
              borderRadius: "6px",
            }}
          >
            {Array.isArray(subdivisions) && subdivisions.map((s) => (
              <MenuItem key={s.id} value={s.id}>
                {s.nom}
              </MenuItem>
            ))}
          </TextField>
        )}
      </div>

      {showPermissionForm && (
        <div className="fixed top-0 left-0 w-full h-full bg-[#00000090] z-50 flex justify-center items-center">
          <Slider
            formData={formData}
            setFormData={setFormData}
            setShowPermissionForm={setShowPermissionForm}
          />
        </div>
      )}

      <div className="flex justify-end mt-4">
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 transition-all duration-200 text-white font-semibold text-sm rounded-lg px-6 py-3 shadow-md"
        >
          Ajouter
        </button>
      </div>
    </Box>
  </Paper>

  <Snackbar open={openSuccess} autoHideDuration={4000} onClose={() => setOpenSuccess(false)}>
    <Alert onClose={() => setOpenSuccess(false)} severity="success" sx={{ width: "100%" }}>
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

export default AjouterUtilisateur;
