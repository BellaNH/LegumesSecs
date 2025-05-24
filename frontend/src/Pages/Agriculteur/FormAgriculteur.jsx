import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import {IoMdInformationCircleOutline} from "react-icons/io"
import { useGlobalContext } from '../../context';
import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
const FormAgriculteur = ({setShowEditForm,showEditForm,setSelectedAgriId,selectedAgriId})=>{
    const {url,fetchAgriculteurs} = useGlobalContext()
    const [openForm,setOpenForm] = useState(true)
    const navigate = useNavigate()
    const [data,setData] = useState({
        nom:"",
        prenom:"",
        phoneNum:"",
        numero_carte_fellah:""
       })
       
    
    useEffect(()=>{
         const fetchAgri = async ()=>{
          console.log(selectedAgriId)
         if(selectedAgriId){
           try {
             const response = await axios.get(`${url}/api/agriculteur/${selectedAgriId}/`,
               {
           headers: {
             Authorization: `Bearer ${localStorage.getItem("token")}`,
           }
           }
           )
   
           console.log(response.data)
           setData(prevData => ({
           ...prevData,
           nom:response.data.nom,
           prenom:response.data.prenom,
           phoneNum:response.data.phoneNum,
           numero_carte_fellah:response.data.numero_carte_fellah
           }))
           
           } catch (error) {
             console.error('Erreur lors de la mise à jour', error);
           }
         }
       }
       fetchAgri()
       
       },[selectedAgriId])

      const handleModifyAgri = async (e)=>{
    e.preventDefault()
    if(selectedAgriId){
      try{
      const response =  await axios.patch(`${url}/api/agriculteur/${selectedAgriId}/`, 
      data, 
      {
      headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  }
)
      console.log(response.data)
      fetchAgriculteurs()
      setSelectedAgriId(null)
      setOpenForm(!openForm)
      setShowEditForm(!showEditForm)
    }catch(error){
      console.log(error)
    }
    }
    
   }

    const handleChange = (e)=>{
        setData({...data,[e.target.name] : e.target.value})
       }
    const handleSubmit = async (e)=>{
        e.preventDefault()
        try{
          const response = await axios.post(`${url}/api/agriculteur/`,data,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
              }
      }
          )
          fetchAgriculteurs()
          navigate("/agriculteurs")
    
        }catch(error){
          console.log(error)
        }
        
       }

       const handleCancel = ()=>{
      setOpenForm(!openForm)
      setShowEditForm(!showEditForm)
      setData({
        ...data,
        nom:"",
        prenom:"",
        phoneNum:"",
        numero_carte_fellah:""      
      })
      navigate("/agriculteurs")
    }
       useEffect(()=>{console.log(selectedAgriId)},[selectedAgriId])
       useEffect(()=>{console.log(data)},[data])
    return(
    <div className={openForm 
      ? "fixed top-0 left-0 w-full h-full bg-[#00000090] z-50 flex justify-center items-center" 
     : ""}>
      {openForm &&
      <form onSubmit={selectedAgriId? handleModifyAgri : handleSubmit} className='relative left-16 w-[55%] h-[65vh]  z-10 rounded-md  grid grid-cols-2 '>
        <div className=' flex flex-col gap-4 px-4 rounded-l-md bg-white '>
            <h3 className='font-semibold text-xl my-4'>Ajouter un agriculteur</h3>
            <TextField value={data.nom} name='nom' onChange={handleChange} label="Nom" variant="standard" size="small" sx={{width:'100%'}}/> 
            <TextField value={data.prenom} name='prenom' onChange={handleChange} label="Prenom" variant="standard" size="small" sx={{ '& .MuiFilledInput-root': { backgroundColor:'#f7fafc' },width:'100%'}}/> 
            
        </div>
        <div className='flex flex-col gap-4 bg-indigo-700 px-4 rounded-r-md ' >
        <IoMdInformationCircleOutline className="text-white w-8 h-8 mt-4 ml-[85%] mb-3"/>
            <TextField value={data.phoneNum} name='phoneNum' onChange={handleChange} InputLabelProps={{sx:{color:'white','&.Mui-focused':{color:'white'}}}} InputProps={{sx:{color:'white','&:before':{borderBottom:'1px solid white'},'&:after':{borderBottom:'1px solid white'}}}} label="Num téléphone" variant="standard" size="small" sx={{width:'100%', '& > :not(style)':{color:'white'},boxShadow:'rgba(149,157,165,0.2) 0px 8px 24px',border:'none' }}/>  
            <TextField value={data.numero_carte_fellah} name='numero_carte_fellah' onChange={handleChange} InputLabelProps={{sx:{color:'white','&.Mui-focused':{color:'white'}}}} InputProps={{sx:{color:'white','&:before':{borderBottom:'1px solid white'},'&:after':{borderBottom:'1px solid white'}}}} label="Num Carte fellah" variant="standard" size="small" sx={{width:'100%', '& > :not(style)':{color:'white'},boxShadow:'rgba(149,157,165,0.2) 0px 8px 24px',border:'none' }}/> 
            
            <div className='flex justify-center gap-6 py-6'>
            <button type='button' onClick={handleCancel} className='bg-white rounded-md w-auto px-8 py-1'>Cancel</button>
            {selectedAgriId
            ?<button type='submit'  className='bg-lime-600 rounded-md w-auto px-8 py-1 text-white text-base'>Modifier</button>
            :<button type='submit'  className='bg-lime-600 rounded-md w-auto px-8 py-1 text-white text-base'>Ajouter</button>}

            </div>
      
       
        </div>
        
    </form>
      }
      
    </div>
    )
    
}
export default FormAgriculteur