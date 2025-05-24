import { useState } from "react"
import {RiArrowDropDownLine} from "react-icons/ri"
import {GiFarmer} from "react-icons/gi"
import {CgProfile} from "react-icons/cg"
import {TbLogout2} from "react-icons/tb"
import {FaPlus} from "react-icons/fa6"
import {IoDocumentOutline} from "react-icons/io5"
import { NavLink } from "react-router-dom"
import { FaUserPlus, FaUsers } from "react-icons/fa";
import { FaClipboardList } from "react-icons/fa";
import { FaMapMarkedAlt } from "react-icons/fa";
import { FaSitemap } from "react-icons/fa";
import { useGlobalContext } from "../context"
import { useLocation } from 'react-router-dom';
import Typography from '@mui/material/Typography';

const Sidebar = ()=>{
    const [openMenu,setOpenMenu] = useState("")
    const {isAuthenticated,user,logout} = useGlobalContext()
    const toggleDropDownMenu = (menuName)=>{
        setOpenMenu(prev=>(prev===menuName?null:menuName))
    }
    const location = useLocation();
    const path = location.pathname;
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    console.log(user)
    const [search, setSearch] = useState("");

   
    const isAdminBanner = user && user.role === 'admin' && (
      <p style={{ color: 'green', fontWeight: 'bold', textAlign: 'center', marginTop: '10px',fontSize: '30px', }}> 
      </p>
    );

      

    const changeOpenStatus = () => {
        setOpen(!open);
    };
    return (
        <div style={{boxShadow:"rgba(0,0,0,0.16) 0px 1px 4px"}}  className="w-[20%] h-[100vh] bg-gray-50 pt-8 pl-6 text-indigo-800 ">
            <div >
               <NavLink id="profile" className={`cursor-pointer  font-semibold py-2 pl-8 hover:bg-indigo-300 hover:text-black  hover:rounded-md flex items-center relative`}>
                    <p>Profile</p>
                    <RiArrowDropDownLine id="profile" onClick={()=>toggleDropDownMenu("profile")} className="text-xl absolute right-4 cursor-pointer"/>
               </NavLink>
               {openMenu==="profile"?<div className="top-8 bg-gray-100  pl-8 text-black text-[0.8rem] ">
               <NavLink to="/profile" className="flex gap-4 items-center py-2 cursor-pointer">
                   <CgProfile className="text-md"/>
                   <p>Voir le profile</p>
                   
               </NavLink>
               <NavLink to="" onClick={logout} className="flex gap-4 items-center py-2 cursor-pointer">
                   <IoDocumentOutline />
                   <p>Se deconnecter</p>
               </NavLink>
              </div>:<></>}
               
              <></>
               
            </div>
            {(user.role.nom === "admin" ||
  user.permissions.find(p => p.model === "utilisateur" && p.retrieve === "true")) && (
  (user.role.nom === "admin" || user.permissions.find(p => p.model === "utilisateur") && p.create === "true") ? (
    <div>
      <NavLink
        id="utilisateurs"
        className="cursor-pointer font-semibold py-2 pl-8 hover:bg-indigo-300 hover:text-black hover:rounded-md flex items-center relative"
      >
        <p>Utilisateurs</p>
        <RiArrowDropDownLine
          id="utilisateurs"
          onClick={() => toggleDropDownMenu("utilisateurs")}
          className="text-xl absolute right-4 cursor-pointer"
        />
      </NavLink>

      {openMenu === "utilisateurs" && (
        <div className="top-8 bg-gray-100 pl-8 text-black text-[0.8rem]">
          <NavLink to="/Admin-Create-User" className="flex gap-4 items-center py-2 cursor-pointer">
            <FaUserPlus size={30} style={{ color: "green", marginRight: "8px" }} />
            <p>Ajouter</p>
          </NavLink>

          <NavLink to="/utilisateurs" className="flex gap-4 items-center py-2 cursor-pointer">
            <FaClipboardList size={20} style={{ color: "purple", marginRight: "8px" }} />
            <p>Consulter</p>
          </NavLink>
        </div>
      )}
    </div>
  ) : (
    <NavLink
        id="utilisateurs"
        to="/utilisateurs"
        className="cursor-pointer font-semibold py-2 pl-8 hover:bg-indigo-300 hover:text-black hover:rounded-md flex items-center relative"
      >
        Utilisateurs
      </NavLink>
  )
)}


        {(user.role.nom === "admin" ||
           user.permissions.find(p => p.model === "wilaya" && p.retrieve === "true")) &&
  
                <NavLink to="/wilayas" id="Wilaya" className={`cursor-pointer  font-semibold py-2 pl-8 hover:bg-indigo-300 hover:text-black  hover:rounded-md flex items-center relative`}>
                    <p>Wilaya</p>
               </NavLink>
        }
           {(user.role.nom === "admin" ||
           user.permissions.find(p => p.model === "subdivision" && p.retrieve === "true")) &&
           
           <NavLink to="/subdivisions" id="Subdivision" className={`cursor-pointer  font-semibold py-2 pl-8 hover:bg-indigo-300 hover:text-black  hover:rounded-md flex items-center relative`}>
                    <p>Subdivision</p>
               </NavLink>
               
    }
    {(user.role.nom === "admin" ||
           user.permissions.find(p => p.model === "commune" && p.retrieve === "true")) &&
           
           <NavLink to="/communes" id="commune" className={`cursor-pointer  font-semibold py-2 pl-8 hover:bg-indigo-300 hover:text-black  hover:rounded-md flex items-center relative`}>
                    <p>commune</p>
               </NavLink>
               
    }
               
    
            <div className="font-semibold cursor-pointer py-2 pl-8 hover:bg-indigo-300 hover:text-black  hover:rounded-md ">Dashboard</div> 
 
       {(user.role.nom === "admin" ||
  user.permissions.find(p => p.model === "objectif" && p.retrieve === "true")) && (
  (user.role.nom === "admin" || user.permissions.find(p => p.model === "objectif" && p.create === "true")) ? (
    <div>
               <div id="objectif" className="font-semibold py-2 pl-8 hover:bg-indigo-300 hover:text-black  hover:rounded-md flex items-center relative cursor-pointer ">
                    <p>Objectif</p>
                    <RiArrowDropDownLine id="objectif" onClick={()=>toggleDropDownMenu("objectif")} className="text-xl absolute right-4 cursor-pointer"/>
               </div>
               {openMenu==="objectif"?
               <div className=" top-8 bg-gray-100  pl-8 text-black text-[0.8rem]">
               <NavLink to="/ajouterobjectif" className="cursor-pointer flex gap-4 items-center py-2">
                   <FaPlus/>
                   <p>Ajouter</p>
                   
               </NavLink>
               <NavLink to="/objectifs" className="cursor-pointer flex gap-4 items-center py-2">
                   <IoDocumentOutline />
                   <p>Consulter</p>
               </NavLink>
              </div>:
              <></>}
               
            </div>
  ) : (
    <NavLink
        id="objectif"
        to="/objectifs"
        className="cursor-pointer font-semibold py-2 pl-8 hover:bg-indigo-300 hover:text-black hover:rounded-md flex items-center relative"
      >
        Objectifs
      </NavLink>
  )
)}
           {(user.role.nom === "admin" ||
        user.permissions.find(p => p.model === "espece" && p.retrieve === "true")) &&
        <NavLink to="/espece" className="cursor-pointer font-semibold py-2 pl-8 hover:bg-indigo-300 hover:text-black  hover:rounded-md flex items-center ">Espece</NavLink> 
        }
           
            {(user.role.nom === "admin" ||
  user.permissions.find(p => p.model === "agriculteurs" && p.retrieve === "true")) && (
  (user.role.nom === "admin" ||user.permissions.find(p => p.model === "agriculteurs" && p.create === "true")) ? (
            <div>
               <div id="agriculteur" className="cursor-pointer font-semibold py-2 pl-8 hover:bg-indigo-300 hover:text-black  hover:rounded-md flex items-center relative ">
                    <p>Agriculteur</p>
                    <RiArrowDropDownLine id="agriculteur" onClick={()=>toggleDropDownMenu("agriculteur")} className="text-xl absolute right-4 cursor-pointer"/>
               </div>
               {openMenu==="agriculteur"?
               <div className="top-8 bg-gray-100  pl-8 text-black text-[0.8rem]">
               <NavLink to="/ajouteragriculteur" className="cursor-pointer flex gap-4 items-center py-2">
                   <FaPlus/>
                   <p>Ajouter</p>
                   
               </NavLink>
               <NavLink to="/agriculteurs" className="cursor-pointer flex gap-4 items-center py-2">
                   <IoDocumentOutline />
                   <p>Consulter</p>
               </NavLink>
              </div>:
              <></>}
               
            </div>
  ) : (
    <NavLink
        id="agriculteurs"
        to="/agriculteurs"
        className="cursor-pointer font-semibold py-2 pl-8 hover:bg-indigo-300 hover:text-black hover:rounded-md flex items-center relative"
      >
        Agriculteurs
    </NavLink>
  )
)}
          {(user.role.nom === "admin" ||
  user.permissions.find(p => p.model === "agriculteurs" && p.retrieve === "true")) && (
  (user.role.nom === "admin" || user.permissions.find(p => p.model === "agriculteurs" && p.create === "true")) ? (
            <div>
               <NavLink id="exploitation" className="cursor-pointer font-semibold py-2 pl-8 hover:bg-indigo-300 hover:text-black  hover:rounded-md flex items-center relative ">
                    <p>Exploitation</p>
                    <RiArrowDropDownLine id="exploitation" onClick={()=>toggleDropDownMenu("exploitation")} className="text-xl absolute right-4 cursor-pointer"/>
               </NavLink>
               {openMenu==="exploitation"?
               <div className=" top-8 bg-gray-100  pl-8 text-black text-[0.8rem]">
               <NavLink to="/ajouterexploitation" className="cursor-pointer flex gap-4 items-center py-2">
                   <FaPlus/>
                   <p>Ajouter</p>
                   
               </NavLink>
               <NavLink to="/exploitations" className="cursor-pointer flex gap-4 items-center py-2">
               <IoDocumentOutline />
                   <p>Consulter</p>
               </NavLink>
              </div>:
              <></>}
               
            </div> 
  ) : (
    <NavLink
        id="exploitations"
        to="/exploitations"
        className="cursor-pointer font-semibold py-2 pl-8 hover:bg-indigo-300 hover:text-black hover:rounded-md flex items-center relative"
      >
        Exploitations
    </NavLink>
  )
)}
            
        </div>
    )
}
export default Sidebar 