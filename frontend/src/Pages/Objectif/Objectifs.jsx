import { useEffect, useState } from "react"
import {MdDelete, MdEdit} from "react-icons/md"
import {BsThreeDotsVertical} from "react-icons/bs"
import { MdModeEdit } from "react-icons/md"
import { useGlobalContext } from "../../context"
import FormObjectif from "./FormObjectif"
const Objectifs = ()=>{
    const [showEditOrDelete,setShowEditOrDelete] = useState(false)
    const {url,user,objectifs,fetchObjectifs} = useGlobalContext()
    const [openMenuId,setOpenMenuId] = useState()
    const [showEditForm,setShowEditForm] =  useState(false)
    const [selectedObjId,setSelectedObjId] = useState()
   

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
         fetchObjectifs()
       } catch (error) {
         console.error("Erreur côté client :", error.response?.data || error.message);
       }
     }; 
    return (
        <div className="w-[78%] pt-20 px-10 pb-10 mx-auto">
            <h3 className='font-semibold text-xl my-4'>Objectifs</h3>
            <div className="grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr_0.5fr] items-center text-left border-b-[1px] border-b-[#d1d5db] py-2 px-0 h-fit">
             <p className="text-sm font-semibold">id</p>
             <p className="text-sm font-semibold">Annee</p>
             <p className="text-sm font-semibold">wilaya</p>
             <p className="text-sm font-semibold ">Espece</p>
             <p className="text-sm font-semibold ">Production</p>

            </div>
            {objectifs && objectifs.map((objectif,index)=>(            
                <div key={index} className="hover:bg-[#f9fafb] grid grid-cols-[0.5fr_1fr_1fr_1fr_1fr_0.5fr] items-center text-left border-b-[1px] border-b-[#d1d5db] py-3 px-0 relative">
                <p className="text-sm ">{objectif.id}</p>
                <p className="text-sm ">{objectif.annee}</p>
                <p className="text-sm ">{objectif.wilaya.nom}</p>
                <p className="text-sm  ml-2">{objectif.espece.nom}</p>
                <p className="text-sm  ml-2">{objectif.objectif_production}</p> 
                            {(user.role.nom === "admin" ||
  user.permissions.find(p => p.model === "Objectif" && (p.update === "true" || p.delete === "true"))) &&
                <div id={objectif.id} onClick={(e)=>showMenu(e,objectif.id)} className="bg-transparent w-6 h-6 rounded-[50%] absolute right-2 hover:bg-gray-300 py-1 cursor-pointer">
                <BsThreeDotsVertical className="mx-auto relative"/>
                </div>
                }
                {openMenuId && objectif.id && String(openMenuId) === String(objectif.id) &&
                            <div style={{boxShadow:"rgba(149,157,165,0.2) 0px 8px 24px"}} className=" z-10 w-34 h-fit bg-white rounded-md absolute top-3 right-9  ">

                            {(user.role.nom === "admin" ||
  user.permissions.find(p => p.model === "Objectif" && p.update === "true")) &&
                               <div onClick={()=>(handleModifyObjectif(objectif.id))} className="flex justify-left gap-8 pb-2 items-center hover:bg-gray-200 transition-colors duration-400 p-2 rounded-t-md cursor-pointer">
                                   <p className="text-sm text-gray-700 font-semibold">Modifier</p>
                                   <MdModeEdit className="text-green-400 text-xl"/>
                               </div>
}
{(user.role.nom === "admin" ||
  user.permissions.find(p => p.model === "Objectif" && p.delete === "true")) &&
                               <div onClick={()=>handleDelete(objectif.id)} className="flex justify-left gap-4 items-center hover:bg-gray-200 p-2 rounded-b-md cursor-pointer">
                                   <p className="text-sm text-gray-700 font-semibold">Supprimer</p>
                                   <MdDelete className="text-red-400 text-xl"/>
                               </div>
}
                            </div>}
               </div>))}

        {showEditForm && (          
            <FormObjectif 
            setShowEditForm={setShowEditForm} showEditForm={showEditForm} 
            setSelectedObjId={setSelectedObjId} selectedObjId={selectedObjId}/>
            )
            }
        </div>
    )
}
export default Objectifs