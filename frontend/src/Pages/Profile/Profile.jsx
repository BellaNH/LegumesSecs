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
      password: user.password
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

  // Only validate if user is trying to change password
  if (currentUser.password || confirmPassword) {
    if (currentUser.password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
  }

  if (currentUser) {
    try {
      const userToSend = { ...currentUser };

      // If no new password is provided, remove it from the payload
      if (!currentUser.password) {
        delete userToSend.password;
      }

      const response = await axios.patch(`${url}/api/user/${currentUser.id}/`, userToSend, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setSuccessMessage(`${currentUser.nom} modifié avec succès ✅`);
      setOpenSuccess(true);
      console.log(response.data);

    } catch (error) {
      setErrorMessage("Erreur d'enregistrement.");
      setOpenError(true);
    }
  }

  console.log("Submit form here.");
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
      onChange={(e) => setConfirmPassword(e.target.value)}
      size="small"
      type={showPassword.input2 ? "text" : "password"}
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