import TextField from '@mui/material/TextField';
import Select  from "@mui/material/Select"
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import React, { useEffect, useState } from 'react'; 
import { useGlobalContext } from '../../context';
import {Snackbar, Alert } from "@mui/material";
import axios from "axios"
const Profile = ()=>{
  const {url,user,setUser,roles} = useGlobalContext()
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState({
    input1:false,
    input2:false
  })
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('')
  const [selectedInputId,setSelectedInputId] = useState()
  const [errorMessage, setErrorMessage] = useState(""); 
const [successMessage, setSuccessMessage] = useState(""); 
const [openError, setOpenError] = useState(false);
const [openSuccess, setOpenSuccess] = useState(false);

  const [currentUser,setCurrentUser] = useState({
        id:"",
        nom:"",
        prenom:"",
        email:"",
        phoneNum:"",
        password:"",
        role_id:""
  })
useEffect(() => {
  if (user) {
    setCurrentUser(prevData => ({
      ...prevData,
      id:user.id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role_id:user.role.id,
      phoneNum: user.phoneNum,
      password: "" // Password should never come from API - always start empty
    }))
  }
}, [user]);

useEffect(() => {
  console.log(currentUser);
}, [currentUser]);

    
  const handleClickShowPassword = (e) => {
    const id = e.currentTarget.id 
    
    setShowPassword((prev)=>({
      ...prev,
      [`input${id}`]: !prev[`input${id}`]
    }
    ))

    }
  

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  }

  const handleChange = (e)=>{

    setCurrentUser({...currentUser,[e.target.name] : e.target.value})
  
   }


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("🔄 [PROFILE] Form submitted");
    console.log("📝 [PROFILE] Current user data:", currentUser);
    console.log("🔑 [PROFILE] Password field:", currentUser.password);
    console.log("🔑 [PROFILE] Confirm password:", confirmPassword);

    // Clear previous errors
    setError("");
    setErrorMessage("");

    // Validate password fields only if user is trying to change password
    // Both fields must be filled if password change is attempted
    const passwordFilled = currentUser.password && currentUser.password.trim();
    const confirmPasswordFilled = confirmPassword && confirmPassword.trim();

    if (passwordFilled || confirmPasswordFilled) {
      // If only one field is filled, show error
      if (!passwordFilled || !confirmPasswordFilled) {
        const errorMsg = "Veuillez remplir les deux champs de mot de passe.";
        setError(errorMsg);
        setErrorMessage(errorMsg);
        setOpenError(true);
        console.error("❌ [PROFILE] Validation error: Both password fields required");
        return;
      }

      // If both are filled, they must match
      if (currentUser.password !== confirmPassword) {
        const errorMsg = "Les mots de passe ne correspondent pas.";
        setError(errorMsg);
        setErrorMessage(errorMsg);
        setOpenError(true);
        console.error("❌ [PROFILE] Validation error: Passwords don't match");
        return;
      }

      // Validate password length if password is being changed
      if (currentUser.password.length < 8) {
        const errorMsg = "Le mot de passe doit contenir au moins 8 caractères.";
        setError(errorMsg);
        setErrorMessage(errorMsg);
        setOpenError(true);
        console.error("❌ [PROFILE] Validation error: Password too short");
        return;
      }
    }

    if (!currentUser || !currentUser.id) {
      const errorMsg = "Erreur: Données utilisateur invalides.";
      setErrorMessage(errorMsg);
      setOpenError(true);
      console.error("❌ [PROFILE] Error: Invalid user data");
      return;
    }

    try {
      console.log("📡 [PROFILE] Preparing API request...");
      
      // Prepare payload - exclude id, convert types
      const userToSend = {
        nom: currentUser.nom,
        prenom: currentUser.prenom,
        email: currentUser.email,
        role_id: currentUser.role_id ? parseInt(currentUser.role_id, 10) : currentUser.role_id,
        phoneNum: currentUser.phoneNum ? (typeof currentUser.phoneNum === 'string' ? parseInt(currentUser.phoneNum, 10) : currentUser.phoneNum) : null,
      };

      // Only include password if both fields are filled and match (already validated above)
      if (passwordFilled && confirmPasswordFilled && currentUser.password === confirmPassword) {
        userToSend.password = currentUser.password;
        console.log("🔑 [PROFILE] Password will be updated");
      } else {
        console.log("ℹ️ [PROFILE] No password change requested");
      }

      console.log("📤 [PROFILE] Sending PATCH request to:", `${url}/api/user/${currentUser.id}/`);
      console.log("📦 [PROFILE] Payload:", userToSend);

      const response = await axios.patch(`${url}/api/user/${currentUser.id}/`, userToSend, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      console.log("✅ [PROFILE] Update successful:", response.data);
      
      setSuccessMessage(`${currentUser.nom} modifié avec succès ✅`);
      setOpenSuccess(true);
      
      // Clear password fields after successful update
      setCurrentUser(prev => ({ ...prev, password: "" }));
      setConfirmPassword("");
      
      // Update user context if needed (optional - depends on your needs)
      if (setUser && response.data) {
        // Only update if backend returns updated user data
        console.log("🔄 [PROFILE] Updating user context");
      }

    } catch (error) {
      console.error("❌ [PROFILE] Error updating user:", error);
      console.error("❌ [PROFILE] Error response:", error.response?.data);
      console.error("❌ [PROFILE] Error status:", error.response?.status);
      console.error("❌ [PROFILE] Full error:", error);
      
      // Extract detailed error message from response
      const errorMsg = error.response?.data?.error?.message 
        || error.response?.data?.message 
        || error.response?.data?.detail
        || error.message 
        || "Erreur d'enregistrement.";
      
      setErrorMessage(errorMsg);
      setError(errorMsg);
      setOpenError(true);
    }
  };
  useEffect(()=>{console.log(selectedInputId)},[selectedInputId])

    return (
<form
  onSubmit={handleSubmit}
  className="w-[65%] h-[98%] bg-white mx-auto my-auto rounded-2xl px-10 py-8 flex flex-col gap-6 shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-all duration-300"
>
  <div className="grid grid-cols-2 gap-8 w-full">
    <div className="flex flex-col gap-2">
      <p className="text-gray-600 font-medium text-sm">Nom</p>
      <input
        onChange={handleChange}
        type="text"
        value={currentUser?.nom || ""}
        name="nom"
        className="bg-gray-50 border border-gray-300 outline-none h-11 rounded-md px-4 focus:ring-2 focus:ring-green-600 transition"
      />
    </div>
    <div className="flex flex-col gap-2">
      <p className="text-gray-600 font-medium text-sm">Prenom</p>
      <input
        onChange={handleChange}
        type="text"
        value={currentUser?.prenom || ""}
        name="prenom"
        className="bg-gray-50 border border-gray-300 outline-none h-11 rounded-md px-4 focus:ring-2 focus:ring-green-600 transition"
      />
    </div>
  </div>

  <div className="flex flex-col gap-2 w-full">
    <p className="text-gray-600 font-medium text-sm">Role</p>
    <TextField
      size="small"
      select
      disabled
      value={user?.role?.nom || ""}
      name="role"
      sx={{
        backgroundColor: "rgba(222, 242, 255, 0.9)",
        borderRadius: "0.375rem",
      }}
    >
      <MenuItem value={user?.role?.nom || ""}>
        {user?.role?.nom || ""}
      </MenuItem>
    </TextField>
  </div>

  <div className="grid grid-cols-2 gap-8 w-full">
    <div className="flex flex-col gap-2">
      <p className="text-gray-600 font-medium text-sm">Email</p>
      <input
        onChange={handleChange}
        type="text"
        value={currentUser?.email || ""}
        name="email"
        className="bg-gray-50 border border-gray-300 outline-none h-11 rounded-md px-4 focus:ring-2 focus:ring-green-600 transition"
      />
    </div>
    <div className="flex flex-col gap-2">
      <p className="text-gray-600 font-medium text-sm">Numero de téléphone</p>
      <input
        onChange={handleChange}
        type="text"
        value={currentUser?.phoneNum || ""}
        name="phoneNum"
        className="bg-gray-50 border border-gray-300 outline-none h-11 rounded-md px-4 focus:ring-2 focus:ring-green-600 transition"
      />
    </div>
  </div>

  <div className="flex flex-col gap-2 w-full">
    <p className="text-gray-600 font-medium text-sm">Nouveau mot de passe</p>
    <OutlinedInput
      id="1"
      value={currentUser?.password || ""}
      onChange={handleChange}
      size="small"
      name="password"
      type={showPassword.input1 ? "text" : "password"}
      autoComplete="new-password"
      className="rounded-md outline-none bg-white"
      endAdornment={
        <InputAdornment position="end">
          <IconButton
            id="1"
            onClick={handleClickShowPassword}
            onMouseDown={handleMouseDownPassword}
            onMouseUp={handleMouseUpPassword}
            edge="end"
          >
            {showPassword.input1 ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      }
      sx={{
        boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.1)",
      }}
    />
  </div>

  <div className="flex flex-col gap-2 w-full">
    <p className="text-gray-600 font-medium text-sm">Confirmer le nouveau mot de passe</p>
    <OutlinedInput
      id="2"
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      size="small"
      type={showPassword.input2 ? "text" : "password"}
      autoComplete="new-password"
      className="rounded-md outline-none bg-white"
      endAdornment={
        <InputAdornment position="end">
          <IconButton
            id="2"
            onClick={(e) => handleClickShowPassword(e)}
            onMouseDown={handleMouseDownPassword}
            onMouseUp={handleMouseUpPassword}
            edge="end"
          >
            {showPassword.input2 ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      }
      sx={{
        boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.1)",
      }}
    />
    {error && (
      <p className="text-red-500 text-sm mt-1">{error}</p>
    )}
  </div>

  <div className="w-full flex justify-end">
    <button
      type="submit"
      className="bg-blue-600 hover:bg-blue-700 transition-all duration-200 text-white font-semibold text-sm rounded-lg px-6 py-3 shadow-md"
    >
      Sauvegarder
    </button>
  </div>

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
</form>

    )
}
export default Profile