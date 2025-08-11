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
const SidebarCopy = ()=>{
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
  className="z-50 w-[20%] h-screen sticky top-0 overflow-y-auto bg-gradient-to-b from-[#292e91] to-blue-500 pt-8 pl-6 text-white flex flex-col gap-4 shadow-xl"
>

  <div>
    <NavLink
      id="profile"
      onClick={(e) => setActive(e.currentTarget.id)}
      className={`cursor-pointer font-medium py-3 px-6 flex items-center justify-between rounded-xl transition-all duration-300 ${
        active === "profile"
          ? "bg-white text-blue-700 shadow-inner"
          : "hover:bg-blue-500/40 hover:shadow-md"
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
      className={`overflow-hidden bg-white/90 rounded-lg mt-2 ml-4 mr-4 text-blue-900 text-sm transition-all duration-300 ${
        openMenu === "profile" ? "max-h-[150px] py-2 px-3" : "max-h-0"
      }`}
    >
      <NavLink
        to="/profile"
        className="flex gap-3 items-center py-2 px-2 rounded-md hover:bg-blue-100 transition"
      >
        <CgProfile className="text-lg" />
        <p>Voir le profil</p>
      </NavLink>
      <NavLink
        to="/login"
        onClick={logout}
        className="flex gap-3 items-center py-2 px-2 rounded-md hover:bg-blue-100 transition"
      >
        <IoDocumentOutline />
        <p>Se déconnecter</p>
      </NavLink>
    </div>
  </div>
  
   <NavLink 
            onClick={(e)=>setActive(e.currentTarget.id)} 
            id="dashboard"
            to="/dashboardCopy" 
            className={`cursor-pointer font-medium py-3 px-6 rounded-xl transition-all duration-300 ${
        active === "dashboard"
          ? "bg-white text-blue-700 shadow-inner"
          : "hover:bg-blue-500/40 hover:shadow-md"
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
              ? "bg-white text-blue-700 shadow-inner"
              : "hover:bg-blue-500/40 hover:shadow-md"
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
          className={`overflow-hidden bg-white/90 rounded-lg mt-2 ml-4 mr-4 text-blue-900 text-sm transition-all duration-300 ${
            openMenu === "utilisateur" ? "max-h-[150px] py-2 px-3" : "max-h-0"
          }`}
        >
          <NavLink
            to="/ajouter-utilisateur"
            className="flex gap-3 items-center py-2 px-2 rounded-md hover:bg-blue-100 transition"
          >
            <FaPlus />
            <p>Ajouter</p>
          </NavLink>
          <NavLink
            to="/utilisateurs"
            className="flex gap-3 items-center py-2 px-2 rounded-md hover:bg-blue-100 transition"
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
export default SidebarCopy 