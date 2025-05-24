import { useEffect, useState } from "react"
import {MdDelete, MdEdit} from "react-icons/md"
import {BsThreeDotsVertical} from "react-icons/bs"
import TextField from '@mui/material/TextField';
import {IoMdInformationCircleOutline} from "react-icons/io"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import Select  from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import { useGlobalContext } from "../../context";
import AxiosInstance from "../../axios";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const FormObjectif = ({setShowEditForm,showEditForm,setSelectedObjId,selectedObjId})=>{

   const {wilayas,especes,url,fetchObjectifs} = useGlobalContext()
   const [selectedWilaya,setSelectedWilaya] = useState("")
   const [selectedEspece,setSelectedEspece] = useState("")
   const [openForm,setOpenForm] = useState(true)
   const navigate = useNavigate()
   const [data,setData] = useState({
    annee:"",
    wilaya:"",
    espece:"",
    objectif_production:""
   })

 
  

    useEffect(()=>{
         const fetchObjectif = async ()=>{
         if(selectedObjId){
           try {
             const response = await axios.get(
               `${url}/api/objectif/${selectedObjId}/`,
               {
           headers: {
             Authorization: `Bearer ${localStorage.getItem("token")}`,
           }
           }
           )
   
           console.log(response.data)
           setData(prevData => ({
           ...prevData,
           annee:response.data.annee,
           wilaya:response.data.wilaya,
           espece:response.data.espece,
           objectif_production:response.data.objectif_production
           }))
           
           } catch (error) {
             console.error('Erreur lors de la mise à jour', error);
           }
         }
       }
       fetchObjectif()
       
       },[selectedObjId])


   const handleChange = (e)=>{
    if(e.target.name==="wilaya"){
      setSelectedWilaya(parseInt(e.target.value))
    }
    if(e.target.name==="espece"){
      setSelectedEspece(e.target.value)
    }
    setData({...data,[e.target.name] : e.target.value})
   }
   useEffect(()=>{console.log(data)},[data])

   const handleModifyObj = async (e)=>{
    e.preventDefault()
    if(selectedObjId){
      try{
      const response =  await axios.patch(`${url}/api/objectif/${selectedObjId}/`, 
      data, 
      {
      headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  }
)
      console.log(response.data)
      fetchObjectifs()
      setSelectedObjId(null)
      setOpenForm(!openForm)
      setShowEditForm(!showEditForm)
    }catch(error){
      console.log(error)
    }
    }
    
   }


   const handleSubmit = async (e)=>{
    console.log(data)
    e.preventDefault()
    try{
      const response = await axios.post(`${url}/api/objectif/`,data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
  }
      )
      fetchObjectifs()
      navigate("/objectifs")

    }catch(error){
      console.log(error)
    }
    
   }
    const handleCancel = ()=>{
      setOpenForm(!openForm)
      setShowEditForm(!showEditForm)
      setData({
        ...data,
        annee:"",
        wilaya:"",
        espece:"",
        objectif_production:""    
      })
      navigate("/objectifs")
    }


    return ( 
    <div className={openForm 
      ? "fixed top-0 left-0 w-full h-full bg-[#00000090] z-50 flex justify-center items-center" 
     : ""}>
      {openForm &&
          <form onSubmit={selectedObjId? handleModifyObj : handleSubmit} className='w-[35%] h-[75vh]  z-10 rounded-md  flex flex-col gap-4 px-8 rounded-l-md bg-white'>
          <h3 className='font-semibold text-xl my-4'>Ajouter un objectif</h3>
          <div className='flex justify-center gap-4'>
          <TextField value={data.annee} name="annee" onChange={handleChange} label="Annee" variant="outlined" size="small" sx={{ '& .MuiFilledInput-root': { backgroundColor:'#f7fafc' },width:'100%','& > :not(style)':{height:'4.5ch'}}}/>  
          <TextField
            select
            label="Wilaya"
            name="wilaya"
            value={selectedObjId? data.wilaya.nom : selectedWilaya}
            fullWidth
            required
            onChange={handleChange}
            size="small"
          > 
            {wilayas.map((wilaya,index)=>(
              <MenuItem value={wilaya.id} key={index}>{wilaya.nom}</MenuItem>
            ))}

          </TextField>

          </div>
          <TextField
            select
            label="Espece"
            name="espece"
            value={selectedObjId? data.espece : selectedEspece}
            fullWidth
            required
            onChange={handleChange}
            size="small"
          > 
            {especes.map((espece,index)=>(
              <MenuItem value={espece.id} key={index}>{espece.nom}</MenuItem>
            ))}

          </TextField>

         
          <TextField value={data.objectif_production} name="objectif_production" onChange={handleChange} id="standard-basic" label="Objectif de production" variant="standard"  />
          <div className='flex justify-center gap-4 mt-8'>
            <button type='button' className='bg-white rounded-md w-auto px-8 py-1' onClick={handleCancel}>Cancel</button>
            {selectedObjId
            ?<button type='submit'  className='bg-lime-600 rounded-md w-auto px-8 py-1 text-white text-base'>Modifier</button>
            :<button type='submit'  className='bg-lime-600 rounded-md w-auto px-8 py-1 text-white text-base'>Ajouter</button>}
          </div> 

    
          
          </form>
          }
          </div>
          
        
       )
     
    
}
export default FormObjectif