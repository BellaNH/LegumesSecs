import { useEffect, useState } from "react"
import {MdDelete, MdEdit} from "react-icons/md"
import {BsThreeDotsVertical} from "react-icons/bs"
import { MdModeEdit } from "react-icons/md"
import { useGlobalContext } from "../../context"
import FormObjectif from "./FormObjectif"
import { data } from "react-router-dom"
import axios from "axios";
import  { Snackbar, Alert} from "@mui/material";
import Cible from "../pics/CiblePic.png"
const Objectifs = ()=>{
    const [showEditOrDelete,setShowEditOrDelete] = useState(false)
    const {url,user,objectifs,fetchObjectifs} = useGlobalContext()
    const [openMenuId,setOpenMenuId] = useState()
    const [showEditForm,setShowEditForm] =  useState(false)
    const [selectedObjId,setSelectedObjId] = useState()
    const [errorMessage, setErrorMessage] = useState(""); 
    const [successMessage, setSuccessMessage] = useState(""); 
    const [openError, setOpenError] = useState(false);
    const [openSuccess, setOpenSuccess] = useState(false);

    const showMenu = (e,id)=>{
        const clickedId = e.currentTarget.id
        if(clickedId === openMenuId){
            setOpenMenuId(null)
        }else{
            setOpenMenuId(clickedId)
        }
    }

    const handleModifyObjectif = (id)=>{
        if(id){
            setShowEditForm(!showEditForm)
            setSelectedObjId(id)
            setOpenMenuId(null)
        }
       
    }
  const handleDelete = async (id) => {
       try {
         const response = await axios.delete(`${url}/api/objectif/${id}/`,
          {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
         }
         )
         console.log(response.data)
         setSuccessMessage(`Objectif supprimé avec succès ✅`);
         setOpenSuccess(true);
         fetchObjectifs()
       } catch (error) {
        setErrorMessage("Erreur lors de la suppression d'objectif");
        setOpenError(true);
       }
     }; 
    return (
<div className="w-[80%] h-fit mt-10 mx-auto flex flex-col items-center">
  <div className="w-[98%] flex flex-col ">
          <div className='flex ml-14 gap-2'> 
                          <img src={Cible} className="w-12 h-12 mt-2" />
                          <h2 className="text-3xl font-bold text-left text-green-600 mb-6 mt-4">
                           Objectif
                         </h2>
                  </div>

 <div className="ml-14 mt-6 w-[86%]">
  <div className="grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr_0.5fr] bg-green-600 text-white text-[15px] font-semibold py-3 px-4 border rounded-t-md shadow-sm">
    <p>ID</p>
    <p>Année</p>
    <p>Wilaya</p>
    <p>Espèce</p>
    <p>Production</p>
  </div>

  {/* Rows */}
  {objectifs && objectifs.map((objectif, index) => (
    <div
      key={index}
      className={"bg-transparent hover:bg-[#f9fafb] grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr_0.5fr] items-center text-sm text-gray-800 border-x border-b border-gray-200 py-3 px-4 transition duration-150 relative"}
    >
      <p>{objectif.id}</p>
      <p>{objectif.annee}</p>
      <p>{objectif.wilaya.nom}</p>
      <p className="ml-2">{objectif.espece.nom}</p>
      <p className="ml-2">{objectif.objectif_production}</p>

      <div className="flex justify-end items-center relative">
        <div
          id={objectif.id}
          onClick={(e) => showMenu(e, objectif.id)}
          className="w-8 h-8 rounded-full hover:bg-green-100 flex items-center justify-center cursor-pointer transition"
        >
          <BsThreeDotsVertical className="text-green-700" />
        </div>

        {openMenuId && String(openMenuId) === String(objectif.id) && (
          <div className="absolute top-0 right-8 bg-white rounded-md w-36 z-10 shadow-lg border border-gray-100">
            <div
              onClick={() => handleModifyObjectif(objectif.id)}
              className="flex items-center gap-2 p-2 hover:bg-green-50 cursor-pointer rounded-t-md"
            >
              <MdModeEdit className="text-green-600 text-[20px]" />
              <p className="text-sm font-medium text-gray-800">Modifier</p>
            </div>
            <div
              onClick={() => handleDelete(objectif.id)}
              className="flex items-center gap-2 p-2 hover:bg-green-50 cursor-pointer rounded-b-md"
            >
              <MdDelete className="text-red-500 text-[20px]" />
              <p className="text-sm font-medium text-gray-800">Supprimer</p>
            </div>
          </div>
        )}
      </div>
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
            <FormObjectif 
            setSelectedObjId={setSelectedObjId} selectedObjId={selectedObjId}/>
            )
            }
        </div>
        </div>
        </div>
    )
}
export default Objectifs