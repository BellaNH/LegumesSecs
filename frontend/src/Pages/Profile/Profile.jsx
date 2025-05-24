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
import axios from "axios"
const Profile = ()=>{
  const {url,user,setUser,roles} = useGlobalContext()
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('')
  const [currentUser,setCurrentUser] = useState({
        id:"",
        nom:"",
        prenom:"",
        email:"",
        phoneNum:"",
        password:""
  })
useEffect(() => {
  if (user) {
    setCurrentUser(prevData => ({
      ...prevData,
      id:user.id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      phoneNum: user.phoneNum,
      password: user.password
    }))
  }
}, [user]);

useEffect(() => {
  console.log(currentUser);
}, [currentUser]);

    
  const handleClickShowPassword = () => setShowPassword((show) => !show)
    
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

      console.log(response.data);
      setError('');
    } catch (error) {
      console.error("Erreur lors de la mise à jour", error);
    }
  }

  console.log("Submit form here.");
};


    return (
    <form onSubmit={handleSubmit} style={{boxShadow:"rgba(0,0,0,0.16) 0px 1px 4px"}} className=" w-[70%] h-[95%] bg-white mx-auto my-auto rounded-md px-8 py-4 flex flex-col gap-4 relative">
        <div className='grid grid-cols-2 gap-8 w-[95%]'>
        <div className='flex flex-col gap-1 '>
           <p className='text-[#5F6368] font-semibold text-[0.9rem]'>Nom</p>
           <input onChange={handleChange} style={{boxShadow:"rgba(0,0,0,0.16) 0px 1px 4px"}} type='text'
           value={currentUser?.nom || ""} name='nom' className='bg-white border-2 border-[#d1d5db] border-[1px] outline-0 h-10 rounded-md px-4'/>
        </div>
        <div className='flex flex-col gap-1 '>
           <p className='text-[#5F6368]  font-semibold text-[0.9rem]'>Prenom</p>
           <input onChange={handleChange} style={{boxShadow:"rgba(0,0,0,0.16) 0px 1px 4px"}} type='text' 
           value={currentUser?.prenom || ""} name='prenom' className='border-2 border-[#d1d5db] border-[1px] outline-0 h-10 rounded-md px-4'/>
        </div>
        </div>
        
        <div className='flex flex-col gap-1 w-[95%] '>
           <p className='text-[#5F6368] font-semibold text-[0.9rem]'>Role</p>
<TextField 
  size='small'
  select
  disabled
  value={user?.role?.nom || ""} 
  name='role'
  sx={{ backgroundColor: 'rgba(222, 237, 255, 0.95)' }}
>
  <MenuItem value={user?.role?.nom || ""}>
    {user?.role?.nom || ""}
  </MenuItem>         
</TextField>

        </div>
        <div className='grid grid-cols-2 gap-8 w-[95%]'>
        <div className='flex flex-col gap-1 '>
           <p className='text-[#5F6368]  font-semibold text-[0.9rem]'>Email</p>
           <input onChange={handleChange} style={{boxShadow:"rgba(0,0,0,0.16) 0px 1px 4px"}} type='text' 
           value={currentUser?.email || ""} name='email' className='border-2 border-[#d1d5db] border-[1px] outline-0 h-10 rounded-md px-4'/>
        </div>
        <div className='flex flex-col gap-1 '>
           <p className='text-[#5F6368]  font-semibold text-[0.9rem]'>Numero de telephone</p>
           <input onChange={handleChange} style={{boxShadow:"rgba(0,0,0,0.16) 0px 1px 4px"}} type='text' 
           value={currentUser?.phoneNum || ""} name='phoneNum' className='border-2 border-[#d1d5db] border-[1px] outline-0 h-10  rounded-md px-4'/>
        </div>
        </div>
        
        <div className='flex flex-col gap-1 w-[95%] '>
           <p className='text-[#5F6368]  font-semibold text-[0.9rem]'>Nouveau mot de passe</p>
           <OutlinedInput
           style={{boxShadow:"rgba(0,0,0,0.16) 0px 1px 4px"}}
            value={currentUser?.password || ""}
            onChange={handleChange}
            size='small'
            name='password'
            className='rounded-md outline-none'
            type={showPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={
                    showPassword ? 'hide the password' : 'display the password'
                  }
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  onMouseUp={handleMouseUpPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
      
          />
        </div>
        <div className='flex flex-col gap-1 w-[95%] '>
           <p className='text-[#5F6368]  font-semibold text-[0.9rem]'>Confirmer le nouveau mot de passe</p>
           <OutlinedInput
           style={{boxShadow:"rgba(0,0,0,0.16) 0px 1px 4px"}}
            onChange={(e)=>setConfirmPassword(e.target.value)}
            size='small'
            className='rounded-md outline-none'
            type={showPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={
                    showPassword ? 'hide the password' : 'display the password'
                  }
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  onMouseUp={handleMouseUpPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
      
          />
        </div>
        

        <button type='submit' className=' bg-[#1A73E8] text-white font-semibold text-[0.9rem] rounded-md w-[20%] h-[7%]'>Sauvegarder</button>
    </form>
    )
}
export default Profile