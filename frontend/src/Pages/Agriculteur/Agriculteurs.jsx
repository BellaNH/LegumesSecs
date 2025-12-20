import { useState } from "react"
import {MdDelete, MdEdit} from "react-icons/md"
import { MdModeEdit } from "react-icons/md"
import {BsThreeDotsVertical} from "react-icons/bs"
import {RiArrowDropDownLine} from "react-icons/ri"
import {RiArrowDropUpLine} from "react-icons/ri"
import { MdKeyboardDoubleArrowDown } from "react-icons/md"
import { useGlobalContext } from '../../context';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Link } from "react-router-dom"
import axios from 'axios';
import { useNavigate } from "react-router-dom"
import FormAgriculteur from "./FormAgriculteur"
import Agriculteur from "../pics/Agriculteur.png"
import  { Snackbar, Alert} from "@mui/material";
import Select  from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import TextField from "@mui/material/TextField"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"


const Agriculteurs = ()=>{
    const [showEditOrDelete,setShowEditOrDelete] = useState(false)
    const [showParcelles,setShowParcelles] = useState(false)
    const [showParcelleInfos,setShowParcelleInfos] = useState(false)
    const [clickAgri,setClickedAgri] = useState(false)
    const [openMenuId,setOpenMenuId] = useState()
    const [selectedAgriId,setSelectedAgriId] = useState()
    const [showEditForm,setShowEditForm] =  useState(false)
      const [errorMessage, setErrorMessage] = useState(""); 
      const [successMessage, setSuccessMessage] = useState(""); 
      const [openError, setOpenError] = useState(false);
      const [openSuccess, setOpenSuccess] = useState(false);
    const {url,user,fetchAgriculteurs,setSelectedExploi
      ,agriculteurs,setAgriculteurs,setSelectedAgriculteur,selectedAgriculteur
      ,wilayas,subdivisions,communes} = useGlobalContext()


    const [openedAgriculteurId,setOpenedAgriculteurId] = useState()
    const [targetWilaya,setTargetWilaya] = useState('')
    const [targetCommune,setTargetCommune] = useState('')
    const [targetSubdiv,setTargetSubdiv] = useState('')
    const [selectedWilaya,setSelectedWilaya] = useState('')
    const [selectedSubdiv,setSelectedSubdiv] = useState('')
    const [selectedCommune,setSelectedCommune] = useState('')
    const [clicked,setClicked] = useState(false)
     const [filteredSubdiv,setFilteredSubdiv] = useState('')
    const [filteredCommune,setFilteredCommune] = useState('')



    const currentWilaya = openedAgriculteurId ? targetWilaya : selectedWilaya;
    const currentSubdiv = openedAgriculteurId ? targetSubdiv : selectedSubdiv;
    const currentCommune = openedAgriculteurId ? targetCommune : selectedCommune;


    const navigate = useNavigate()
    const handleSelectExploi = (id)=>{
        if(id){
            setSelectedExploi(id)
            navigate("/exploitations")
        }
    }

    const showMenu = (e,id)=>{
        const clickedId = e.currentTarget.id
        if(clickedId === openMenuId){
            setOpenMenuId(null)
        }else{
            setOpenMenuId(clickedId)
        }
    }
    const handleModifyAgri = (id)=>{
        if(id){
            setShowEditForm(!showEditForm)
            setSelectedAgriId(id)
            setOpenMenuId(null)
        }
       
    }
      const handleDelete = async (id) => {
       try {
         const response = await axios.delete(`${url}/api/agriculteur/${id}/`,
          {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
         }
         )
         setSuccessMessage(`Agriculteur supprimé avec succès ✅`);
         setOpenSuccess(true);
         fetchAgriculteurs()
       } catch (error) {
        setErrorMessage("Erreur lors de la suppression d'agiculteur");
        setOpenError(true);
       }
     }; 
    const fetchFilteredAgri = async (wilaya = null, subdivision = null, commune = null) => {
    try {
        const response = await axios.get(`${url}/api/agriculteur-filter/`, {
            params: {
                wilaya,
                subdivision,
                commune
            },
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        setAgriculteurs(response.data)
    } catch (error) {
        // Error handled by interceptor
    }
};
    
    const filterSubdivByWilaya = async (selectedWilaya)=>{
        if(selectedWilaya){
        try{  
            const response = await axios.get(`${url}/api/filterSubdivBywilaya/?wilaya=${selectedWilaya}`,
            {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`
                }
        })
        setFilteredSubdiv(response.data)
    }catch(error){
        // Error handled by interceptor
        }
    }}
    const filterCommuneByWilaya = async (selectedWilaya)=>{
        if(selectedWilaya){
        try{  
            const response = await axios.get(`${url}/api/filterCommuneBywilaya/?wilaya=${selectedWilaya}`,
            {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`
                }
        })
        setFilteredCommune(response.data)
    }catch(error){
        // Error handled by interceptor
        }
    }}
    const filterCommuneBySubdiv = async (selectedSubdiv)=>{
        if(selectedSubdiv){
        try{
        const response = await axios.get(`${url}/api/filterCommuneBySubdiv/?subdivision=${selectedSubdiv}`,
            {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`
                }
        })
    setFilteredCommune(response.data)  
    }catch(error){
        // Error handled by interceptor
        }
    }} 

    const onChange = (e)=>{     
        const {name,value} = e.target
        if(name ==="wilaya"){
     
            setSelectedWilaya(value || "")
            filterSubdivByWilaya(value)
            filterCommuneByWilaya(value)
            fetchFilteredAgri(value)
            
        }
        if(name ==="subdiv"){

            setSelectedSubdiv(value || "")
            filterCommuneBySubdiv(value)
            fetchFilteredAgri(selectedWilaya,value,selectedCommune)
        }
        if(name ==="commune"){
            setSelectedCommune(value || "")
            fetchFilteredAgri(selectedWilaya,selectedSubdiv,value)
        }
    }
     const showAgriLocation = (e)=>{
      const clickedId = e.currentTarget.id
        if(clickedId === openedAgriculteurId){
            setOpenedAgriculteurId(null)
        }else{
            setOpenedAgriculteurId(clickedId)
            setTargetWilaya(e.currentTarget.dataset.wilaya)
            setTargetCommune(e.currentTarget.dataset.commune)
            setTargetSubdiv(e.currentTarget.dataset.subdiv) 
        }

     }
    
    return (
      <div style={{boxShadow:"rgba(0,0,0,0.16) 0px 1px 4px"}} 
      className="blurred-bg relative flex flex-col w-[80%]">
          <div className="flex flex-col gap-6 w-[90%] mt-14 py-4 mx-auto z-0">
            <div className="flex gap-4">
                <img src={Agriculteur} className="w-12 h-12"/> 
                {clicked?
            <h3 className="text-3xl font-bold text-left text-green-600 mt-2 mb-6">Localisation</h3>:
            <h3 className="text-3xl font-bold text-left text-green-600 mt-2 mb-6">Filtrage par localisation</h3>}
            </div>
         <div
  style={{
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
    background: "rgba(255, 255, 255, 0.3)",
  }}
  className="rounded-lg mb-12 flex justify-between px-8 py-6 border border-green-600"
>
            <FormControl size="small" className="w-[30%] " variant="outlined">
                <InputLabel>Wilaya</InputLabel>
                {wilayas.length > 0 &&
                <Select 
                disabled={!!openedAgriculteurId} 
                name="wilaya" 
                sx={{backgroundColor:"white"}} 
                onChange={(e)=>onChange(e)} 
                value={(user.role.nom==="agent_dsa" || user.role.nom==="agent_subdivision") ? user.wilaya.id:currentWilaya} 
                label="wilaya" 
                className="w-[100%]">
                <MenuItem value=""><em>None</em></MenuItem> 
                {wilayas.map((wilaya,index)=>(
                              <MenuItem value={wilaya.id} key={index}>{wilaya.nom}</MenuItem>
                            ))}

                </Select>
}
            </FormControl>

            <FormControl size="small" className="w-[30%] " variant="outlined">
                <InputLabel>Subdiv</InputLabel>
                {subdivisions.length > 0 &&
                <Select disabled={!!openedAgriculteurId} name="subdiv" 
                sx={{backgroundColor:"white"}} 
                onChange={(e)=>onChange(e)} 
                value={user.role.nom==="agent_subdivision"? user.subdivision.id:currentSubdiv} label="wilaya" className="w-[100%]">
                    <MenuItem value=""><em>None</em></MenuItem> 
                {!openedAgriculteurId && filteredSubdiv.length > 0 ? 
                filteredSubdiv.map((subdiv,index)=>{return <MenuItem key={index} value={subdiv.id}>{subdiv.nom}</MenuItem>})
                :subdivisions.map((subdiv,index)=>{
                    return <MenuItem key={index} value={subdiv.id}>{subdiv.nom}</MenuItem>
                  })
                
            }
                </Select>  
}  
            </FormControl>

            <FormControl size="small" className="w-[30%] " variant="outlined">
                <InputLabel>Commune</InputLabel>
                {communes.length > 0 &&
                <Select 
                disabled={!!openedAgriculteurId} name="commune" 
               sx={{backgroundColor:"white"}}
                onChange={(e)=>onChange(e)} 
                value={currentCommune} label="Commune" className="w-[100%]">
                <MenuItem value=""><em>None</em></MenuItem> 
                {!openedAgriculteurId &&  filteredCommune.length > 0 
                ? filteredCommune.map((commune,index)=>{
                                  return <MenuItem key={index} value={commune.id}>{commune.nom}</MenuItem>
                }):
                communes.map((commune,index)=>{
                                  return <MenuItem key={index} value={commune.id}>{commune.nom}</MenuItem>}
                )}
                </Select>
}
            
            </FormControl>
            
        </div>
        </div>
         <div className="w-[100%] pt-4 px-10 pb-10" >
            <div className="grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1fr_0.5fr] bg-green-600 text-white font-semibold text-sm py-3 px-4 rounded-t-md shadow-sm border border-gray-200">
             <p className="text-sm font-semibold">id</p>
             <p className="text-sm font-semibold">Nom</p>
             <p className="text-sm font-semibold">Prénom</p>
             <p className="text-sm font-semibold ">Téléphone</p>
             <p className="text-sm font-semibold ">Num Carte Fellah</p>
             <p className="text-sm font-semibold ml-12">Exploitation</p>
            </div>
           {agriculteurs.map((agri, index) => (
  <div
    key={index}
    id={agri.id} 
    data-wilaya={agri?.wilaya?.id} 
    data-subdiv={agri?.subdivision?.id} 
    data-commune={agri.commune?.id} 
    onClick={(e) => showAgriLocation(e)}
    className={`${
      agri.exploitation && agri.exploitation.length > 0 && agri.exploitation.id === selectedAgriculteur
        ? "bg-blue-50"
        : "bg-transparent"
    } hover:bg-[#f9fafb] grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1fr_0.5fr] items-center text-sm text-gray-800 border-x border-b border-gray-200 py-3 px-4 transition duration-150 relative`}
  >
    
    <p className="text-sm">{agri.id}</p>

 
    <p className="text-sm">{agri.nom}</p>

    
    <p className="text-sm">{agri.prenom}</p>

    <p className="text-sm">{agri.phoneNum}</p>

 
    <p className="text-sm">{agri.numero_carte_fellah}</p>
    {agri.exploitation   ? 
       <Link
      to="/exploitations"
      onClick={() => handleSelectExploi(agri.id)}
      className="ml-14 text-blue-500 font-semibold text-[0.9rem]"
    >
  {agri.exploitation?.nom}
    </Link>

    :
    <span className="text-red-600 text-lg font-bold ml-16">❌</span>
    }
   
      <div
        id={agri.id}
        onClick={(e) => showMenu(e, agri.id)}
        className="w-full flex justify-end items-center pr-2"
      >
        <div className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-300 cursor-pointer">
          <BsThreeDotsVertical />
        </div>
      </div>


    {openMenuId &&
      agri.id &&
      String(openMenuId) === String(agri.id) && (
        <div
          style={{ boxShadow: "rgba(149,157,165,0.2) 0px 8px 24px" }}
          className="z-10 w-34 bg-white rounded-md absolute top-0 right-14"
        >
            <div
              onClick={() => handleModifyAgri(agri.id)}
              className="flex justify-start gap-3 items-center hover:bg-gray-200 transition-colors duration-300 p-2 rounded-t-md cursor-pointer"
            >
              <p className="text-sm text-gray-700 font-semibold">Modifier</p>
              <MdModeEdit className="text-green-400 text-xl" />
            </div>
            <div
              onClick={() => handleDelete(agri.id)}
              className="flex justify-start gap-3 items-center hover:bg-gray-200 transition-colors duration-300 p-2 rounded-b-md cursor-pointer"
            >
              <p className="text-sm text-gray-700 font-semibold">Supprimer</p>
              <MdDelete className="text-red-400 text-xl" />
            </div>
        
        </div>
      )}
  </div>
))}
          <Snackbar open={openSuccess} autoHideDuration={4000} onClose={()=>setOpenSuccess(false)}>
                                              <Alert onClose={()=>setOpenSuccess(false)} severity="success" sx={{ width: "100%" }}>
                                                {successMessage}
                                              </Alert>
                                            </Snackbar>
                                
                                              <Snackbar open={openError} autoHideDuration={4000} onClose={() => setOpenError(false)}>
                                                <Alert onClose={() => setOpenError(false)} severity="error" sx={{ width: "100%" }}>
                                                  {errorMessage}
                                                </Alert>
                                              </Snackbar>
        {showEditForm && (          
            <FormAgriculteur 
            setSelectedAgriId={setSelectedAgriId} 
            selectedAgriId={selectedAgriId}/>
            )
            }
         </div>
        </div>
    )
}
export default Agriculteurs