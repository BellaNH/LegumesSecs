import { lazy, Suspense } from 'react'
import Sidebar from "./components/Sidebar"
import './styles/AppLayout.css'
import {Routes,Route, Navigate} from "react-router-dom"
import { useGlobalContext } from './context.jsx'
import ProtectedRoute from './components/common/ProtectedRoute'
import PageLoader from './components/common/PageLoader'
import { useLanguage } from './i18n/LanguageContext'

// Lazy load components for code splitting
const FormExploi = lazy(() => import('./Pages/Exploitation/FormExploi.jsx'))
const Exploitations = lazy(() => import("./Pages/Exploitation/Exploitations.jsx"))
const AjouterParcelle = lazy(() => import('./Pages/Parcelle/AjouterParcelle.jsx'))
const FormAgriculteur = lazy(() => import('./Pages/Agriculteur/FormAgriculteur.jsx'))
const Agriculteurs = lazy(() => import('./Pages/Agriculteur/Agriculteurs.jsx'))
const Objectifs = lazy(() => import('./Pages/Objectif/Objectifs.jsx'))
const FormObjectif = lazy(() => import('./Pages/Objectif/FormObjectif.jsx'))
const Login = lazy(() => import('./Pages/Login.jsx'))
const Register = lazy(() => import('./Pages/Register.jsx'))
const ForgotPassword = lazy(() => import('./Pages/ForgotPassword.jsx'))
const ResetPassword = lazy(() => import('./Pages/ResetPassword.jsx'))
const VerifyEmail = lazy(() => import('./Pages/VerifyEmail.jsx'))
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
const Role = lazy(() => import("./Pages/Role/Role.jsx"))

const LoadingFallback = () => <PageLoader />

function App() {
  const {isAuthenticated, authLoading} = useGlobalContext()
  const { t } = useLanguage()

  if (authLoading) {
    return <PageLoader />
  }

  return (
    <div className="app-shell">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:bg-green-600 focus:text-white focus:p-2">
        {t('skipLink')}
      </a>
      {isAuthenticated && <Sidebar />}
      <main id="main-content" className="app-main" role="main">
        <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} />
          <Route path="/forgot-password" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
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
