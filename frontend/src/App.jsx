import { useState, lazy, Suspense } from 'react'
import Sidebar from "./components/Sidebar"
import {Routes,Route} from "react-router-dom"
import { useGlobalContext } from './context.jsx'
import { Box, CircularProgress } from '@mui/material'
import ProtectedRoute from './components/common/ProtectedRoute'

// Lazy load components for code splitting
const FormExploi = lazy(() => import('./Pages/Exploitation/FormExploi.jsx'))
const Exploitations = lazy(() => import("./Pages/Exploitation/Exploitations.jsx"))
const AjouterParcelle = lazy(() => import('./Pages/Parcelle/AjouterParcelle.jsx'))
const FormAgriculteur = lazy(() => import('./Pages/Agriculteur/FormAgriculteur.jsx'))
const Agriculteurs = lazy(() => import('./Pages/Agriculteur/Agriculteurs.jsx'))
const Objectifs = lazy(() => import('./Pages/Objectif/Objectifs.jsx'))
const FormObjectif = lazy(() => import('./Pages/Objectif/FormObjectif.jsx'))
const Login = lazy(() => import('./Pages/Login.jsx'))
const Suiviparcelles = lazy(() => import("./Pages/Suiviparcelles.jsx"))
const AjouterUtilisateur = lazy(() => import("./Pages/Utilisateur/AjouterUtilisateur.jsx"))
const Utilisateurs = lazy(() => import("./Pages/Utilisateur/Utilisateurs.jsx"))
const ModifierUtilisateur = lazy(() => import("./Pages/Utilisateur/ModifierUtilisateur.jsx"))
const WilayasPage = lazy(() => import("./Pages/Wilaya/wilayapage.jsx"))
const Subdivision = lazy(() => import("./Pages/Subdivision/Subdivision.jsx"))
const AjouterSubdivision = lazy(() => import("./Pages/Subdivision/AjouterSubdivision.jsx"))
const Communes = lazy(() => import("./Pages/Commune/Communes.jsx"))
const AjouterCommunes = lazy(() => import("./Pages/Commune/AjouterCommunes.jsx"))
const Espece = lazy(() => import('./Pages/Espece/Espece.jsx'))
const DashboardDisplayed = lazy(() => import('./Pages/Dashboard/DashboardDisplay.jsx'))
const Profile = lazy(() => import('./Pages/Profile/Profile.jsx'))
const Slider = lazy(() => import("./Pages/Utilisateur/PermissionSlider/Slider.jsx"))
const EspeceSurfaceChart = lazy(() => import('./Pages/Dashboard/EspeceSurfaceChart .jsx'))
const Role = lazy(() => import("./Pages/Role/Role.jsx"))

const LoadingFallback = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      width: '100%',
    }}
  >
    <CircularProgress />
  </Box>
)

function App() {
  const [add,setAdd]= useState(0)
  const {isAuthenticated} = useGlobalContext()

    
  
  return (
    <div className='flex flex-col md:flex-row h-[100vh] overflow-y-auto'>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:bg-green-600 focus:text-white focus:p-2">
        Aller au contenu principal
      </a>
      {isAuthenticated && <Sidebar drawerWidth={147} />}
      <main id="main-content" className="flex-1" role="main">
        <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="" element={isAuthenticated ? <DashboardDisplayed /> : <Login />} />
          <Route path="/slider" element={<ProtectedRoute><Slider /></ProtectedRoute>} />
          <Route path="/role" element={<ProtectedRoute><Role /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardDisplayed /></ProtectedRoute>} />
          <Route path="/admin-create-user" element={<ProtectedRoute><AjouterUtilisateur /></ProtectedRoute>} />
          <Route path="/utilisateurs" element={<ProtectedRoute><Utilisateurs /></ProtectedRoute>} />
          <Route path="/ajouter-utilisateur" element={<ProtectedRoute><AjouterUtilisateur /></ProtectedRoute>} />
          <Route path="/modifier-utilisateur/:id" element={<ProtectedRoute><ModifierUtilisateur /></ProtectedRoute>} />
          <Route path="/wilayas" element={<ProtectedRoute><WilayasPage /></ProtectedRoute>} />
          <Route path="/subdivisions" element={<ProtectedRoute><Subdivision /></ProtectedRoute>} />
          <Route path="/ajouter-subdivision" element={<ProtectedRoute><AjouterSubdivision /></ProtectedRoute>} />
          <Route path="/communes" element={<ProtectedRoute><Communes /></ProtectedRoute>} />
          <Route path="/ajouter-commune" element={<ProtectedRoute><AjouterCommunes /></ProtectedRoute>} />
          <Route path='/ajouterexploitation' element={<ProtectedRoute><FormExploi /></ProtectedRoute>} />
          <Route path='/exploitations' element={<ProtectedRoute><Exploitations /></ProtectedRoute>} />
          <Route path='/espece' element={<ProtectedRoute><Espece /></ProtectedRoute>} />
          <Route path='/ajouteragriculteur' element={<ProtectedRoute><FormAgriculteur /></ProtectedRoute>} />
          <Route path="/agriculteurs" element={<ProtectedRoute><Agriculteurs /></ProtectedRoute>} />
          <Route path='/ajouterparcelle' element={<ProtectedRoute><AjouterParcelle /></ProtectedRoute>} />
          <Route path='/ajouterobjectif' element={<ProtectedRoute><FormObjectif /></ProtectedRoute>} />
          <Route path='/objectifs' element={<ProtectedRoute><Objectifs /></ProtectedRoute>} />
        </Routes>
      </Suspense>
      </main>
    </div>
  )
}

export default App
