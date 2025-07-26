import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import {IoMdInformationCircleOutline} from "react-icons/io"
import { useGlobalContext } from "../../context"
import MenuItem from "@mui/material/MenuItem"
import axios from "axios";
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Plus from "../pics/Plus.png"
import Modifer from "../pics/Modifier.png"

export default function AjouterParcelle({modifiedParcelleId,setModifiedParcelleId}) {
  const {fetchExploitationWithParcelles,especes,setExploitationId,exploitationId,url,modifiedParcelle} = useGlobalContext()
  const [wrong,setWrong] = useState(false)
  const [selectedEspece,setSelectedEspece] = useState("")
  useEffect(()=>{console.log(exploitationId)},[exploitationId])
  const [data,setData] = useState({         
    exploitation:exploitationId,
    espece_id:"",  
    annee:"",
    superficie:"",
    sup_labouree:"",
    sup_emblavee:"",
    sup_sinsitree:"",
    sup_recoltee:"",
    sup_deserbee:"",
    prev_de_production:"",
    production:"",
    engrais_de_fond:"",
    engrais_de_couverture:""

  })
  const navigate = useNavigate()

  useEffect(()=>{
      const fetchModifiedParcelle = async ()=>{
      if(modifiedParcelleId){
        try {
          const response = await axios.get(
            `${url}/api/parcelle/${modifiedParcelleId}/`,
            {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
        }
        )

       console.log(response.data)
        setData(prevData => ({
        ...prevData,
        exploitation:exploitationId,
        espece_id:response.data.espece.id,  
        annee:response.data.annee,
        superficie:response.data.superficie,
        sup_labouree:response.data.sup_labouree,
        sup_emblavee:response.data.sup_emblavee,
        sup_sinsitree:response.data.sup_sinsitree,
        sup_recoltee:response.data.sup_recoltee,
        sup_deserbee:response.data.sup_deserbee,
        prev_de_production:response.data.prev_de_production,
        production:response.data.production,
        engrais_de_fond:response.data.engrais_de_fond,
        engrais_de_couverture:response.data.engrais_de_couverture
        }))
        fetchExploitationWithParcelles()
        } catch (error) {
          console.error('Erreur lors de la mise à jour', error);
        }
      }
    }
    fetchModifiedParcelle()
    },[exploitationId])
 


   const handleModifyParcelle = async (e)=>{
    e.preventDefault()
    if(modifiedParcelleId){
      try{
      const response =  await axios.patch(`${url}/api/parcelle/${modifiedParcelleId}/`, 
      data, 
      {
      headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  }
)


      console.log(response.data)
      fetchExploitationWithParcelles()
      setExploitationId(null)
      setModifiedParcelleId(null)
    }catch(error){
      console.log(error)
    }
    }
    
   }
   useEffect(()=>{console.log(data)},[data])
  const isValid = (e)=>{
    const value = e.target.value
    if(value===null || (isNaN(value) || isNaN(parseFloat(value)))){
      setWrong(true)
    }
  }
  const handleChange = (e)=>{
    if(e.target.name==="espece_id"){
      setSelectedEspece(e.target.value)
    }
    setData({...data,[e.target.name] : e.target.value})
   }
   const handleSubmit = async (e)=>{
    console.log(data)
    e.preventDefault()
    try{
      const response = await axios.post(`${url}/api/parcelle/`,data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
     }
      )
      console.log(response.data)
      fetchExploitationWithParcelles()
      setExploitationId(null)

    }catch(error){
      console.log(error)
    }
    
   }
  
  const handleCancel = ()=>{
      setExploitationId(null)
      setData({
        exploitation:exploitationId,
        espece_id:"",  
    annee:"",
    superficie:"",
    sup_labouree:"",
    sup_emblavee:"",
    sup_sinsitree:"",
    sup_recoltee:"",
    sup_deserbee:"",
    prev_de_production:"",
    production:"",
    engrais_de_fond:"",
    engrais_de_couverture:""
    
      
      })
    }
 useEffect(()=>{console.log(data)},[data])
  useEffect(()=>{console.log(modifiedParcelleId)},[modifiedParcelleId])
  return (
    <div className={exploitationId 
      ? "fixed top-0 left-0 w-full h-full bg-[#00000090] z-50 flex justify-center items-center" 
     : ""}>

      {exploitationId &&
      
      <form onSubmit={modifiedParcelleId ? handleModifyParcelle : handleSubmit } 
      className='ml-24 w-[50%] h-[65vh]   z-10 rounded-md  grid grid-cols-2'>
      <div className='flex flex-col gap-4 px-4 rounded-l-md bg-white'>
    {modifiedParcelleId?
              <div className='flex gap-3 '>
                <img src={Modifer} alt='' className='w-6 h-6 mt-5'/>
              <h3 className='font-semibold text-green-600 text-xl my-4'>Modifier la parcelle</h3>
              </div> 
              :
              <div className='flex gap-3 '>
              <img src={Plus} alt='' className='w-6 h-6 mt-5'/>
              <h3 className='font-semibold text-green-600 text-xl my-4'>Ajouter une parcelle</h3>
              </div>
              
              }
      
      <TextField value={data.annee} onChange={handleChange} name="annee" label="Annee" variant="outlined" size="small" sx={{ '& .MuiFilledInput-root': { backgroundColor:'#f7fafc' },width:'100%','& > :not(style)':{height:'4.5ch'}}}/>
      <TextField value={data.superficie}  onChange={handleChange} name="superficie" id="standard-basic" label="Superficie" variant="standard"  />
      <TextField value={data.sup_labouree}  onChange={handleChange} name="sup_labouree" id="standard-basic" label="Superficie labourée" variant="standard" />
      <div className='flex justify-center gap-4'>
      <TextField value={data.engrais_de_fond} onChange={handleChange} name="engrais_de_fond" label="engrais de fond" variant="outlined" size="small" sx={{ '& .MuiFilledInput-root': { backgroundColor:'#f7fafc' },width:'100%','& > :not(style)':{height:'4.5ch'}}}/>  
      <TextField value={data.engrais_de_couverture} onChange={handleChange} name="engrais_de_couverture" label="engrais de couverture" variant="outlined" size="small" sx={{ '& .MuiFilledInput-root': { backgroundColor:'#f7fafc' },width:'100%','& > :not(style)':{height:'4.5ch'}}} />
      </div>
      <TextField value={data.sup_emblavee} onChange={handleChange} name="sup_emblavee" id="standard-basic" label="Superficie emblavée" variant="standard"  />
        </div>
      <div className='flex flex-col gap-4 bg-green-700 px-4 rounded-r-md'>
        <IoMdInformationCircleOutline className="text-white w-8 h-8 mt-4 ml-[88%] mb-3"/>
       <TextField
  value={data.sup_deserbee}
  onChange={handleChange}
  name="sup_deserbee"
  id="standard-basic"
  label="Superficie deserbée"
  variant="standard"
  InputLabelProps={{
    sx: {
      color: 'white',
      '&.Mui-focused': { color: 'white' },
    }
  }}
  InputProps={{
    sx: {
      color: 'white',
      '&:before': { borderBottom: '1px solid white' },  
      '&:after': { borderBottom: '2px solid white' },    
    }
  }}
  sx={{ width: '100%' }}
/>

<TextField
  value={data.prev_de_production}
  onChange={handleChange}
  name="prev_de_production"
  label="prev de production"
  variant="outlined"
  size="small"
  InputLabelProps={{
    sx: {
      color: 'white',
      '&.Mui-focused': { color: 'white' },
    }
  }}
  InputProps={{
    sx: {
      color: 'white',
      '& fieldset': { borderColor: 'white' },           
      '&:hover fieldset': { borderColor: 'white' },       
      '&.Mui-focused fieldset': { borderColor: 'white' }  
    }
  }}
  sx={{
    backgroundColor: '#ffffff10',
    width: '100%',
    '& > :not(style)': { height: '4.5ch' },
  }}
/>

      <div className='flex justify-center gap-4'>
      <TextField value={data.sup_sinsitree}  onChange={handleChange} name="sup_sinsitree" InputLabelProps={{sx:{color:'white','&.Mui-focused':{color:'#e9e7e8'}}}} InputProps={{sx:{color:'#e9e7e8','&:before':{borderBottom:'1px solid #e9e7e8'}}}} label="Superficie sinistrée" variant="standard" size="small" sx={{ '& .MuiFilledInput-root': { backgroundColor:'#f7fafc' },width:'100%'}} />
      <TextField value={data.sup_recoltee} onChange={handleChange} name="sup_recoltee" InputLabelProps={{sx:{color:'white','&.Mui-focused':{color:'#e9e7e8'}}}} InputProps={{sx:{color:'#e9e7e8','&:before':{borderBottom:'1px solid #e9e7e8'}}}} label="Superficie récoltée" variant="standard" size="small" sx={{ '& .MuiFilledInput-root': { backgroundColor:'#f7fafc' },width:'100%'}}/>  
      </div>
      <div className='flex justify-center gap-4 mt-3'>
<TextField
  select
  label="espece"
  name="espece_id"
  value={exploitationId ? data.espece_id : selectedEspece}
  fullWidth
  required
  onChange={handleChange}
  size="small"
  InputLabelProps={{
    sx: {
      color: 'white',
      '&.Mui-focused': { color: 'white' },
    }
  }}
  InputProps={{
    sx: {
      color: 'white',
      '& fieldset': { borderColor: 'white' },
      '&:hover fieldset': { borderColor: 'white' },
      '&.Mui-focused fieldset': { borderColor: 'white' },
    }
  }}
  sx={{
    width: '100%',
    backgroundColor: '#ffffff10', 
    '& .MuiSelect-select': { color: 'white' },
  }}
>
  {especes.map((espece, index) => (
    <MenuItem value={espece.id} key={index}>{espece.nom}</MenuItem>
  ))}
</TextField>

<TextField
  value={data.production}
  onChange={handleChange}
  name="production"
  label="Production"
  variant="outlined"
  size="small"
  InputLabelProps={{
    sx: {
      color: 'white',
      '&.Mui-focused': { color: 'white' },
    }
  }}
  InputProps={{
    sx: {
      color: 'white',
      '& fieldset': { borderColor: 'white' },
      '&:hover fieldset': { borderColor: 'white' },
      '&.Mui-focused fieldset': { borderColor: 'white' },
    }
  }}
  sx={{
    width: '100%',
    backgroundColor: '#ffffff10',
    '& > :not(style)': { height: '4.5ch' },
  }}
/>

      </div> 
      <div className='flex justify-center gap-4 mt-4'>
        <button type='button' onClick={handleCancel} className='bg-white rounded-md w-auto px-8 py-1'>Cancel</button>
        {modifiedParcelleId
        ?<button type="submit" className='bg-lime-600 rounded-md w-auto px-8 py-1 text-white text-base'>Modifier</button>
        :<button type="submit" className='bg-lime-600 rounded-md w-auto px-8 py-1 text-white text-base'>Ajouter</button>
        }
        
      </div> 
      
      </div>
      
    </form>
    }
      
    </div>
    
  );
}
