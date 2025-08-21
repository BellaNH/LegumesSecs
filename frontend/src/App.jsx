import { useState } from 'react'
import Sidebar from "./components/Sidebar"
import FormExploi from './Pages/Exploitation/FormExploi.jsx'
import Exploitations from "./Pages/Exploitation/Exploitations.jsx"
import AjouterParcelle from './Pages/Parcelle/AjouterParcelle.jsx'
import FormAgriculteur from './Pages/Agriculteur/FormAgriculteur.jsx'
import Agriculteurs from './Pages/Agriculteur/Agriculteurs.jsx'
import {Routes,Route} from "react-router-dom"
import Objectifs from './Pages/Objectif/Objectifs.jsx'
import FormObjectif from './Pages/Objectif/FormObjectif.jsx'
import Login from './Pages/Login.jsx'
import NavBar from "./Pages/NavBar.jsx"
import { useGlobalContext } from './context.jsx'
import Suiviparcelles from "./Pages/Suiviparcelles.jsx"
import AjouterUtilisateur from "./Pages/Utilisateur/AjouterUtilisateur.jsx"
import Utilisateurs from "./Pages/Utilisateur/Utilisateurs.jsx"
import ModifierUtilisateur from "./Pages/Utilisateur/ModifierUtilisateur.jsx"
import WilayasPage from "./Pages/Wilaya/wilayapage.jsx"
import Subdivision from "./Pages/Subdivision/Subdivision.jsx"
import AjouterSubdivision from "./Pages/Subdivision/AjouterSubdivision.jsx"
import Communes from "./Pages/Commune/Communes.jsx"
import AjouterCommunes from "./Pages/Commune/AjouterCommunes.jsx"
import Espece from './Pages/Espece/Espece.jsx'
import DashboardDisplayed  from './Pages/Dashboard/DashboardDisplay.jsx'
import Profile from './Pages/Profile/Profile.jsx'
import { Navigate } from 'react-router-dom'
import Slider from "./Pages/Utilisateur/PermissionSlider/Slider.jsx"
import EspeceSurfaceChart from './Pages/Dashboard/EspeceSurfaceChart .jsx'
import Role from "./Pages/Role/Role.jsx"

function App() {
  const [add,setAdd]= useState(0)
  const {isAuthenticated} = useGlobalContext()

    
  
  return (
    <div className='flex h-[100vh] overflow-y-auto'>
      {isAuthenticated && <Sidebar drawerWidth={147} />}
      <Routes>
        <Route path="/slider" element={<Slider/>} />
        <Route path="" element={isAuthenticated?<DashboardDisplayed/>:<Login/>} />
        <Route path="/role" element={<Role />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<DashboardDisplayed />} />
        <Route path="/admin-create-user" element={<AjouterUtilisateur />} />
        <Route path="/utilisateurs" element={<Utilisateurs />} />
        <Route path="/ajouter-utilisateur" element={<AjouterUtilisateur />} />
        <Route path="/modifier-utilisateur/:id" element={<ModifierUtilisateur/>} />
        <Route path="/wilayas" element={isAuthenticated ? <WilayasPage /> : <Login/>} />
        <Route path="/subdivisions" element={<Subdivision />} />
        <Route path="/ajouter-subdivision" element={<AjouterSubdivision />} />
        <Route path="/communes" element={<Communes />} />
        <Route path="/ajouter-commune" element={<AjouterCommunes />} />
        <Route path='/ajouterexploitation' element={<FormExploi/>}/>
        <Route path='/exploitations' element={<Exploitations/>}/>
        <Route path='/espece' element={<Espece/>}/>
        <Route path='/ajouteragriculteur' element={<FormAgriculteur/>}/>   
        <Route path="/agriculteurs" element={<Agriculteurs />} />    
        <Route path='/ajouterparcelle' element={<AjouterParcelle/>}/>
        <Route path='/ajouterobjectif' element={<FormObjectif/>}/>
        <Route path='/objectifs' element={<Objectifs/>}/>

      </Routes>
     

    </div>
  )
}

export default App
