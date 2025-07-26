// ModifierUtilisateur.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useGlobalContext } from "../../context";
import { Box, TextField, Button, Typography, MenuItem, Container, Paper, Snackbar, Alert } from "@mui/material";
import Slider from './PermissionSlider/Slider'
import Modifier from "../pics/Modifier.png"


const ModifierUtilisateur = () => {


  const [showPermissionForm, setShowPermissionForm] = useState(false);
  const { id } = useParams();
  const [initialPerm,setInitialPerm] = useState([])
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
  email: "",
  role_id: "",
  permissions: [],
});
 const {url,wilayas,subdivisions,roles
  ,setCurrentUserPermissions,currentUserPermissions,setSliderStatus} = useGlobalContext()
   const [selectedRole, setSelectedRole] = useState('')
   const [selectedWilaya,setSelectedWilaya]= useState('')
   const [selectedSubdivision,setSelectedSubdivision]= useState('')
   const [successMessage, setSuccessMessage] = useState("");
   const [errorMessage, setErrorMessage] = useState(""); 
   const [openSnackbar, setOpenSnackbar] = useState(false);

 useEffect(() => {
  const token = localStorage.getItem("token");

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${url}/api/user/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res.data);
      setInitialPerm(res.data.permissions);
      setFormData((prev)=>(
        {...prev,
          email:res.data.email, 
          role_id:res.data.role.id,
          permissions:res.data.permissions,
        }
      ))
      console.log(res.data.permissions)
      setSelectedRole(res.data.role.id)
      setSliderStatus("edit")
      setCurrentUserPermissions(res.data.permissions)
      console.log(res.data.role.permissions)
      if (res.data.role.nom === "agent_dsa") {
        const locationRes = await axios.get(`${url}/api/userWilaya/?user=${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(locationRes.data)
       setSelectedWilaya(locationRes.data[0].wilaya); 
      } else if (res.data.role.nom === "agent_subdivision") {
        const locationRes = await axios.get(`${url}/api/userSubdiv/?user=${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(locationRes.data)
        console.log(locationRes.data.subdivision)
        setSelectedSubdivision(locationRes.data[0].subdivision); 
      }
    } catch (err) {
      console.error("Erreur lors du chargement de l'utilisateur :", err);
    }
  };

  fetchUser();
}, []);

  
  const handleChange = (e, modelName = null) => {
  const { name, type, checked, value } = e.target;

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
    if(name ==="role_id"){
      setSelectedRole(value)
    }
    if(name==="wilaya"){
      setSelectedWilaya(value)
    }
    if(name==="subdivision"){
      setSelectedSubdivision(value)
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }
  };

const [originalRoleName, setOriginalRoleName] = useState("");


useEffect(() => {
  if (formData && formData.role) {
    setOriginalRoleName(formData.role.nom); 
  }
}, [formData]);


const handleSubmit = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem("token");

  try {
    const payload = {
      email: formData.email,
      role_id: selectedRole,  
      permissions: formData?.permissions,  
    };
    if(selectedRole==3){
      payload.wilaya=selectedWilaya
    }
    if(selectedRole==4){
      payload.subdivision=selectedSubdivision
    }
    const res = await axios.patch(`${url}/api/user/${id}/`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setSuccessMessage(`${formData.nom} modifié avec succés ✅`);
    setOpenSnackbar(true)
    console.log("Update successful", res.data);
    navigate("/utilisateurs");
  } catch (error) {
     const backendMessage = error.response?.data?.detail || "Erreur inconnue.";
    console.error("Erreur lors de la mise à jour :", backendMessage);
    setErrorMessage(backendMessage);
    setOpenSnackbar(true)
  }
};





  const handleCancel = () => {
    navigate("/utilisateurs");
  };
 useEffect(()=>{console.log(formData)},[formData])
 useEffect(()=>{console.log(location)},[location])
 useEffect(()=>{console.log(subdivisions)},[subdivisions])
 useEffect(()=>{console.log(selectedRole)},[selectedRole])
  useEffect(()=>{console.log(currentUserPermissions)},[currentUserPermissions])
  useEffect(()=>{console.log(selectedSubdivision)},[selectedSubdivision])
  return (
    <div className="w-[80%] min-h-screen flex justify-center items-center px-6 py-12 bg-gray-50">
  <div className="w-[80%] h-[60vh] bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] px-10 py-8 flex flex-col gap-6 transition-all duration-300">
    <div className='flex align-center gap-4'> 
                       <img src={Modifier} className="w-8 h-8 mt-1" />
                       <h2 className="text-3xl font-bold text-left text-green-600 mb-6 mt-1">
                        Modifier utilisateur
                      </h2>
     </div>

    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <TextField
        value={formData?.email}
        size="small"
        label="Email"
        name="email"
        type="email"
        fullWidth
        required
        onChange={(e) => handleChange(e)}
        sx={{
          backgroundColor: "#f9fafb",
          borderRadius: "0.375rem"
        }}
      />

      <TextField
        select
        label="Rôle"
        name="role_id"
        value={selectedRole || ""}
        onChange={(e) => handleChange(e)}
        fullWidth
        required
        size="small"
        sx={{
          backgroundColor: "#f9fafb",
          borderRadius: "0.375rem"
        }}
      >
        {roles && roles.filter(role => role.nom !== "admin").map((role, index) => (
          <MenuItem value={role.id} key={index}>{role.nom}</MenuItem>
        ))}
      </TextField>

      <div className="grid grid-cols-2 gap-6">
        {selectedRole && selectedRole === 3 && (
          <TextField
            select
            label="Wilaya"
            name="wilaya"
            value={selectedWilaya || ""}
            onChange={(e) => handleChange(e)}
            fullWidth
            required
            size="small"
            sx={{
              backgroundColor: "#f9fafb",
              borderRadius: "0.375rem"
            }}
          >
            {wilayas.map((item, index) => (
              <MenuItem key={index} value={item.id}>
                {item.nom}
              </MenuItem>
            ))}
          </TextField>
        )}

        {selectedRole && selectedRole === 4 && (
          <TextField
            select
            label="Subdivision"
            name="subdivision"
            value={selectedSubdivision || ""}
            onChange={(e) => handleChange(e)}
            fullWidth
            required
            size="small"
            sx={{
              backgroundColor: "#f9fafb",
              borderRadius: "0.375rem"
            }}
          >
            {subdivisions.map((item, index) => (
              <MenuItem key={index} value={item.id}>
                {item.nom}
              </MenuItem>
            ))}
          </TextField>
        )}

        <button
          type="button"
          className="bg-green-100 text-green-700 font-semibold rounded-md h-10 w-full shadow-sm hover:bg-green-200 transition"
          onClick={() => (setSliderStatus("edit"), setShowPermissionForm(true))}
        >
          Permissions
        </button>
      </div>

      <div className="flex justify-end gap-4 mt-4">
        <button type='button' className='bg-red-600 rounded-md w-auto px-8 py-1 text-white font-semibold' 
        onClick={handleCancel}>Cancel
        </button>
        <button type='submit'  className='bg-lime-600 rounded-md w-auto px-8 py-2 text-white text-base'>Modifier</button>

      </div>
    </form>
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

  <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={() => setOpenSnackbar(false)}>
    <Alert onClose={() => setSuccessMessage("")} severity="success" sx={{ width: "100%" }}>
      {successMessage}
    </Alert>
  </Snackbar>

  <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={() => setOpenSnackbar(false)}>
    <Alert onClose={() => setErrorMessage("")} severity="error" sx={{ width: "100%" }}>
      {errorMessage}
    </Alert>
  </Snackbar>
</div>

  );
};

export default ModifierUtilisateur;
