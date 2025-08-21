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
import "./Sidebar.css"
const Sidebar = ()=>{
    const [openMenu,setOpenMenu] = useState("")
    const {isAuthenticated,user,logout} = useGlobalContext() 
    const [active,setActive] = useState("")
    const [open, setOpen] = useState(false);

    const toggleDropDownMenu = (menuName)=>{
        setOpenMenu(prev=>(prev===menuName?null:menuName))
        setOpen(true)
    }
    const location = useLocation();
    const path = location.pathname;
    
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    console.log(user)
    const [search, setSearch] = useState("");

    return (
<div
  style={{
    scrollbarWidth: "none",
  }}
  className="z-50 w-[20%] h-screen sticky top-0 overflow-y-auto bg-gradient-to-b from-green-800 to-green-600 pt-8 pl-6 text-white flex flex-col gap-4 shadow-xl"
>

  <div>
    <NavLink
      id="profile"
      onClick={(e) => setActive(e.currentTarget.id)}
      className={`cursor-pointer font-medium py-3 px-6 flex items-center justify-between rounded-xl transition-all duration-300 ${
        active === "profile"
          ? "bg-white text-green-700 shadow-inner"
          : "hover:bg-green-500/40 hover:shadow-md"
      }`}
    >
      <p>Profile</p>
      <RiArrowDropDownLine
        id="profile"
        onClick={() => toggleDropDownMenu("profile")}
        className="text-2xl"
      />
    </NavLink>
    <div
      className={`overflow-hidden bg-white/90 rounded-lg mt-2 ml-4 mr-4 text-green-900 text-sm transition-all duration-300 ${
        openMenu === "profile" ? "max-h-[150px] py-2 px-3" : "max-h-0"
      }`}
    >
      <NavLink
        to="/profile"
        className="flex gap-3 items-center py-2 px-2 rounded-md hover:bg-green-100 transition"
      >
        <CgProfile className="text-lg" />
        <p>Voir le profil</p>
      </NavLink>
      <NavLink
        to=""
        onClick={logout}
        className="flex gap-3 items-center py-2 px-2 rounded-md hover:bg-green-100 transition"
      >
        <IoDocumentOutline />
        <p>Se déconnecter</p>
      </NavLink>
    </div>
  </div>
  
   <NavLink 
            onClick={(e)=>setActive(e.currentTarget.id)} 
            id="dashboard"
            to="/dashboard" 
            className={`cursor-pointer font-medium py-3 px-6 rounded-xl transition-all duration-300 ${
        active === "dashboard"
          ? "bg-white text-green-700 shadow-inner"
          : "hover:bg-green-500/40 hover:shadow-md"
      }`}
          >Dashboard
          </NavLink> 
          
  {user &&
    (user.role.nom === "admin" ||
      user.permissions.some(
        (p) => p.model === "Utilisateur" && (p.create || p.retrieve)
      )) && (
      <div>
        <div
          onClick={(e) => setActive(e.currentTarget.id)}
          id="utilisateur"
          className={`cursor-pointer font-medium py-3 px-6 flex items-center justify-between rounded-xl transition-all duration-300 ${
            active === "utilisateur"
              ? "bg-white text-green-700 shadow-inner"
              : "hover:bg-green-500/40 hover:shadow-md"
          }`}
        >
          <p>Utilisateur</p>
          <RiArrowDropDownLine
            id="utilisateur"
            onClick={() => toggleDropDownMenu("utilisateur")}
            className="text-2xl"
          />
        </div>
        <div
          className={`overflow-hidden bg-white/90 rounded-lg mt-2 ml-4 mr-4 text-green-900 text-sm transition-all duration-300 ${
            openMenu === "utilisateur" ? "max-h-[150px] py-2 px-3" : "max-h-0"
          }`}
        >
          <NavLink
            to="/ajouter-utilisateur"
            className="flex gap-3 items-center py-2 px-2 rounded-md hover:bg-green-100 transition"
          >
            <FaPlus />
            <p>Ajouter</p>
          </NavLink>
          <NavLink
            to="/utilisateurs"
            className="flex gap-3 items-center py-2 px-2 rounded-md hover:bg-green-100 transition"
          >
            <IoDocumentOutline />
            <p>Consulter</p>
          </NavLink>
        </div>
      </div>
    )}

  {user && user.role.nom === "admin" && (
    <NavLink
      onClick={(e) => setActive(e.currentTarget.id)}
      id="role"
      to="/role"
      className={`cursor-pointer font-medium py-3 px-6 rounded-xl transition-all duration-300 ${
        active === "role"
          ? "bg-white text-green-700 shadow-inner"
          : "hover:bg-green-500/40 hover:shadow-md"
      }`}
    >
      Role
    </NavLink>
  )}

  {user && user.role.nom === "admin" && (
    <NavLink
      onClick={(e) => setActive(e.currentTarget.id)}
      to="/wilayas"
      id="Wilaya"
      className={`cursor-pointer font-medium py-3 px-6 rounded-xl transition-all duration-300 ${
        active === "Wilaya"
          ? "bg-white text-green-700 shadow-inner"
          : "hover:bg-green-500/40 hover:shadow-md"
      }`}
    >
      <p>Wilaya</p>
    </NavLink>
  )}
          {user && user.role.nom==="admin"
      &&  <NavLink 
            onClick={(e)=>setActive(e.currentTarget.id)}
           to="/subdivisions" 
           id="Subdivision" 
           className={`cursor-pointer font-medium py-3 px-6 rounded-xl transition-all duration-300 ${
        active === "Subdivision"
          ? "bg-white text-green-700 shadow-inner"
          : "hover:bg-green-500/40 hover:shadow-md"
      }`}>
          <p>Subdivision</p>
          </NavLink>
          }   
          
          {user && user.role.nom==="admin"
          &&
           <NavLink
            onClick={(e)=>setActive(e.currentTarget.id)} 
           to="/communes" 
           id="commune" 
          className={`cursor-pointer font-medium py-3 px-6 rounded-xl transition-all duration-300 ${
        active === "commune"
          ? "bg-white text-green-700 shadow-inner"
          : "hover:bg-green-500/40 hover:shadow-md"
      }`}
           >
                    <p>Commune</p>
               </NavLink>
}
    
      {user && user.role.nom==="admin" 
      && 
        <NavLink 
        onClick={(e)=>setActive(e.currentTarget.id)} 
        id="espece"
        to="/espece" 
         className={`cursor-pointer font-medium py-3 px-6 rounded-xl transition-all duration-300 ${
        active === "espece"
          ? "bg-white text-green-700 shadow-inner"
          : "hover:bg-green-500/40 hover:shadow-md"
      }`}
        >Espece
        </NavLink> 
}
       {user &&
    (user.role.nom === "admin" ||
      user.permissions.some(
        (p) => p.model === "Objectif" && (p.create || p.retrieve)
      )) && (
      <div>
        <div
          onClick={(e) => setActive(e.currentTarget.id)}
          id="objectif"
          className={`cursor-pointer font-medium py-3 px-6 flex items-center justify-between rounded-xl transition-all duration-300 ${
            active === "objectif"
              ? "bg-white text-green-700 shadow-inner"
              : "hover:bg-green-500/40 hover:shadow-md"
          }`}
        >
          <p>Objectif</p>
          <RiArrowDropDownLine
            id="objectif"
            onClick={() => toggleDropDownMenu("objectif")}
            className="text-2xl"
          />
        </div>
        <div
          className={`overflow-hidden bg-white/90 rounded-lg mt-2 ml-4 mr-4 text-green-900 text-sm transition-all duration-300 ${
            openMenu === "objectif" ? "max-h-[150px] py-2 px-3" : "max-h-0"
          }`}
        >
          <NavLink
            to="/ajouterobjectif"
            className="flex gap-3 items-center py-2 px-2 rounded-md hover:bg-green-100 transition"
          >
            <FaPlus />
            <p>Ajouter</p>
          </NavLink>
          <NavLink
            to="/objectifs"
            className="flex gap-3 items-center py-2 px-2 rounded-md hover:bg-green-100 transition"
          >
            <IoDocumentOutline />
            <p>Consulter</p>
          </NavLink>
        </div>
      </div>
    )}


       {user &&
    (user.role.nom === "admin" ||
      user.permissions.some(
        (p) => p.model === "Agriculteur" && (p.create || p.retrieve)
      )) && (
      <div>
        <div
          onClick={(e) => setActive(e.currentTarget.id)}
          id="Agriculteur"
          className={`cursor-pointer font-medium py-3 px-6 flex items-center justify-between rounded-xl transition-all duration-300 ${
            active === "Agriculteur"
              ? "bg-white text-green-700 shadow-inner"
              : "hover:bg-green-500/40 hover:shadow-md"
          }`}
        >
          <p>Agriculteur</p>
          <RiArrowDropDownLine
            id="Agriculteur"
            onClick={() => toggleDropDownMenu("Agriculteur")}
            className="text-2xl"
          />
        </div>
        <div
          className={`overflow-hidden bg-white/90 rounded-lg mt-2 ml-4 mr-4 text-green-900 text-sm transition-all duration-300 ${
            openMenu === "Agriculteur" ? "max-h-[150px] py-2 px-3" : "max-h-0"
          }`}
        >
          <NavLink
            to="/ajouteragriculteur"
            className="flex gap-3 items-center py-2 px-2 rounded-md hover:bg-green-100 transition"
          >
            <FaPlus />
            <p>Ajouter</p>
          </NavLink>
          <NavLink
            to="/agriculteurs"
            className="flex gap-3 items-center py-2 px-2 rounded-md hover:bg-green-100 transition"
          >
            <IoDocumentOutline />
            <p>Consulter</p>
          </NavLink>
        </div>
      </div>
    )}

     {user &&
    (user.role.nom === "admin" ||
      user.permissions.some(
        (p) => p.model === "Exploitation" && (p.create || p.retrieve)
      )) && (
      <div>
        <div
          onClick={(e) => setActive(e.currentTarget.id)}
          id="Exploitation"
          className={`cursor-pointer font-medium py-3 px-6 flex items-center justify-between rounded-xl transition-all duration-300 ${
            active === "Exploitation"
              ? "bg-white text-green-700 shadow-inner"
              : "hover:bg-green-500/40 hover:shadow-md"
          }`}
        >
          <p>Exploitation</p>
          <RiArrowDropDownLine
            id="Exploitation"
            onClick={() => toggleDropDownMenu("Exploitation")}
            className="text-2xl"
          />
        </div>
        <div
          className={`overflow-hidden bg-white/90 rounded-lg mt-2 ml-4 mr-4 text-green-900 text-sm transition-all duration-300 ${
            openMenu === "Exploitation" ? "max-h-[150px] py-2 px-3" : "max-h-0"
          }`}
        >
          <NavLink
            to="/ajouterexploitation"
            className="flex gap-3 items-center py-2 px-2 rounded-md hover:bg-green-100 transition"
          >
            <FaPlus />
            <p>Ajouter</p>
          </NavLink>
          <NavLink
            to="/exploitations"
            className="flex gap-3 items-center py-2 px-2 rounded-md hover:bg-green-100 transition"
          >
            <IoDocumentOutline />
            <p>Consulter</p>
          </NavLink>
        </div>
      </div>
    )}


            
        </div>
    )
}
export default Sidebar 