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

const Agriculteurs = ()=>{
    const [showEditOrDelete,setShowEditOrDelete] = useState(false)
    const [showParcelles,setShowParcelles] = useState(false)
    const [showParcelleInfos,setShowParcelleInfos] = useState(false)
    const [clickAgri,setClickedAgri] = useState(false)
    const [openMenuId,setOpenMenuId] = useState()
    const [selectedAgriId,setSelectedAgriId] = useState()
    const [showEditForm,setShowEditForm] =  useState(false)
    const {url,user,fetchAgriculteurs,setSelectedExploi,agriculteurs,setSelectedAgriculteur,selectedAgriculteur} = useGlobalContext()
    const navigate = useNavigate()
    const handleSelectExploi = (id)=>{
        console.log(id)
        if(id){
            setSelectedExploi(id)
            navigate("/exploitations")
        }
        
    }



    useEffect(()=>{console.log(selectedAgriculteur)},[selectedAgriculteur])

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
         console.log(response.data)
         fetchAgriculteurs()
       } catch (error) {
         console.error("Erreur côté client :", error.response?.data || error.message);
       }
     }; 

    return (
        <div className="w-[80%] pt-20 px-10 pb-10">
            <h3 className='font-semibold text-xl my-4'>Agriculteurs</h3>
            <div className="grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1fr_0.5fr] items-center text-left border-b-[1px] border-b-[#d1d5db] py-2 px-0 h-fit">
             <p className="text-sm font-semibold">id</p>
             <p className="text-sm font-semibold">Nom</p>
             <p className="text-sm font-semibold">Prénom</p>
             <p className="text-sm font-semibold ">Téléphone</p>
             <p className="text-sm font-semibold ">Num Carte Fellah</p>
             <p className="text-sm font-semibold ml-12">Exploitation</p>
            </div>
           {agriculteurs.map((agri,index)=>(
                        <div 
                        onClick={()=>setSelectedAgriculteur(null)} key={index} 
                        className={`
                        ${agri.exploitations && agri.exploitations.length > 0 && agri.exploitations[0].id === selectedAgriculteur?"bg-blue-50":"bg-transparent"} 
                        hover:bg-[#f9fafb] grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr_1fr_0.5fr] items-center text-left border-b-[1px] border-b-[#d1d5db] py-3 px-0 relative`}>
                          <p className="text-sm ">{agri.id}</p>
                          <p className="text-sm ">{agri.nom}</p>
                          <p className="text-sm ">{agri.prenom}</p>
                          <p className="text-sm  ml-2">{agri.phoneNum}</p>
                          <p className="text-sm  ml-2">{agri.numero_carte_fellah}</p>
                          <Link to="/exploitations" 
                          onClick={(e)=>handleSelectExploi(agri.id)} 
                          className="cursor-pointer text-blue-500 font-semibold text-[0.9rem]">
                          {agri.exploitations && agri.exploitations.length > 0 ? agri.exploitations[0].nom : "No exploitation"}
                          </Link>
                          
                                      {(user.role.nom === "admin" ||
  user.permissions.find(p => p.model === "Agriculteur" && p.retrieve === "true")) &&
                          <div id={agri.id} onClick={(e)=>showMenu(e,agri.id)} className="bg-transparent w-6 h-6 rounded-[50%] absolute right-2 hover:bg-gray-300 py-1 cursor-pointer">
                          <BsThreeDotsVertical className="mx-auto relative"/>
                          </div>
}
                          {openMenuId && agri.id && String(openMenuId) === String(agri.id) &&
                          <div style={{boxShadow:"rgba(149,157,165,0.2) 0px 8px 24px"}} className="z-10 w-34 h-fit bg-white rounded-md absolute top-3 right-9  ">
            {(user.role.nom === "admin" ||
  user.permissions.find(p => p.model === "Agriculteur" && p.update === "true")) &&


                             <div onClick={()=>(handleModifyAgri(agri.id))} className="flex justify-left gap-8 pb-2 items-center hover:bg-gray-200 transition-colors duration-400 p-2 rounded-t-md cursor-pointer">
                                 <p className="text-sm text-gray-700 font-semibold">Modifier</p>
                                 <MdModeEdit className="text-green-400 text-xl"/>
                             </div>
}

            {(user.role.nom === "admin" ||
  user.permissions.find(p => p.model === "Agriculteur" && p.delete === "true")) &&
                             <div onClick={()=>handleDelete(agri.id)} className="flex justify-left gap-4 items-center hover:bg-gray-200 p-2 rounded-b-md cursor-pointer">
                                 <p className="text-sm text-gray-700 font-semibold">Supprimer</p>
                                 <MdDelete className="text-red-400 text-xl"/>
                             </div>
}
                          </div>}
                         </div>
           ))}

        {showEditForm && (          
            <FormAgriculteur 
            setShowEditForm={setShowEditForm} showEditForm={showEditForm} 
            setSelectedAgriId={setSelectedAgriId} selectedAgriId={selectedAgriId}/>
            )
            }
         
        </div>
    )
}
export default Agriculteurs