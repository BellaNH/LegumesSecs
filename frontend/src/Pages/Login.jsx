import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { useGlobalContext } from "../context";
import authService from "../services/api/authService";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Link,
  IconButton,
  InputAdornment,
  Paper,
} from "@mui/material";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [welcomeMsg,setWelcomeMsg] =useState("")
   const [newPassword, setNewPassword] = useState("");
  const [forgotOpen, setForgotOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const navigate = useNavigate();
  const { login, url } = useGlobalContext();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // DETECTIVE LOG: Starting login process
      console.log("🔐 [LOGIN] Starting login process for:", email);
      
      // Use direct axios call like old version for better visibility
      console.log("📡 [LOGIN] Calling:", `${url}/api/token/`);
      const response = await axios.post(`${url}/api/token/`, {
        email,
        password,
      });
      
      // DETECTIVE LOG: Token received
      const { access, refresh, user: userFromToken } = response.data;
      console.log("✅ [LOGIN] Token received successfully");
      console.log("🔑 [LOGIN] Access token:", access);
      console.log("👤 [LOGIN] User data from token:", userFromToken);
      console.log("🎭 [LOGIN] Role from token:", userFromToken?.role);
      
      // Call login with just access token (like old version)
      console.log("🔄 [LOGIN] Calling login function with access token");
      await login(access);
      
      console.log("✅ [LOGIN] Login process completed successfully");
      setTimeout(() => {
        console.log("🚀 [LOGIN] Navigating to dashboard");
        navigate("/dashboard")
      }, 1500);
    }
    catch (error) {
      console.error("❌ [LOGIN] Error during login:", error);
      console.error("❌ [LOGIN] Error response:", error.response?.data);
      console.error("❌ [LOGIN] Error status:", error.response?.status);
      console.error("❌ [LOGIN] Full error:", error);
      const errorMessage = error.response?.data?.error?.message || 
                          error.response?.data?.detail || 
                          error.response?.data?.error || 
                          error.message ||
                          "Identifiants invalides";
      alert(`Erreur: ${errorMessage}`);
    }
  }
  
  const handlePasswordReset = async () => {
    if (!resetEmail || !newPassword) {
      alert("Veuillez remplir tous les champs");
      return;
    }
    
    if (newPassword.length < 8) {
      alert("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }
    
    try {
      await authService.resetPassword(resetEmail, newPassword);
      alert("Mot de passe réinitialisé avec succès ✅");
      setForgotOpen(false);
      setNewPassword("");
      setResetEmail("");
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || 
                          error.response?.data?.error || 
                          "Erreur lors de la réinitialisation";
      alert(errorMessage);
    }
  };
return (
<Box
  sx={{
    minHeight: '100vh',
    width: '100vw',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    bgcolor: '#f4f6f8',
    p: 2,
  }}
>
  <Paper
    elevation={6}
    sx={{
      p: 4,
      borderRadius: 4,
      width: '100%',
      maxWidth: 420,
      boxSizing: 'border-box',
    }}
  >
        <Typography variant="h5" align="center" gutterBottom fontWeight="bold">
          Connexion
        </Typography>

        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            label="Adresse email"
            variant="outlined"
            margin="normal"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <TextField
  fullWidth
  label="Mot de passe"
  variant="outlined"
  margin="normal"
  type={showPassword ? "text" : "password"}
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  required
/>

<Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
  <input
    type="checkbox"
    id="showPassword"
    checked={showPassword}
    onChange={() => setShowPassword(!showPassword)}
    style={{ marginRight: 8 }}
  />
  <label htmlFor="showPassword" style={{ fontSize: "0.9rem" }}>
    Afficher le mot de passe
  </label>
</Box>


         <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, py: 1.5 ,bgcolor:"#16a34a"}}
          >
            Se connecter
          </Button>
        </form>
<Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
  <Link
    component="button"
    variant="body2"
    onClick={() => setForgotOpen(true)}
    sx={{ color: "#44c034ff", textDecoration: "none" }}
  >
    Mot de passe oublié ?
  </Link>
</Box>



        {welcomeMsg && (
          <Typography
            variant="subtitle1"
            align="center"
            sx={{
              mt: 3,
              bgcolor: "#e0f2f1",
              color: "#004d40",
              py: 1,
              px: 2,
              borderRadius: 2,
              fontWeight: "bold",
            }}
          >
            {welcomeMsg}
          </Typography>
        )}
      </Paper>

      <Dialog
  open={forgotOpen}
  onClose={() => setForgotOpen(false)}
  PaperProps={{
    sx: {
      p: 3,
      borderRadius: 3,
      minWidth: { xs: 300, sm: 400 },
      bgcolor: "#fefefe",
    },
  }}
>
  <DialogTitle
    sx={{
      textAlign: "center",
      fontWeight: "bold",
      fontSize: "1.3rem",
      mb: 1,
      color: "#16a34a",
    }}
  >
    🔐  mot de passe oublié ?
  </DialogTitle>

  <DialogContent>
    <Typography variant="body2" sx={{ mb: 2 }}>
      Veuillez saisir votre adresse email et le nouveau mot de passe :
    </Typography>

    <TextField
      fullWidth
      label="Adresse email"
      type="email"
      value={resetEmail}
      onChange={(e) => setResetEmail(e.target.value)}
      margin="dense"
    />

    <TextField
  fullWidth
  label="Nouveau mot de passe"
  type={showNewPassword ? "text" : "password"}
  value={newPassword}
  onChange={(e) => setNewPassword(e.target.value)}
  margin="dense"
  sx={{ mt: 2 }}
/>

<Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
  <input
    type="checkbox"
    id="showNewPassword"
    checked={showNewPassword}
    onChange={() => setShowNewPassword(!showNewPassword)}
    style={{ marginRight: 8 }}
  />
  <label htmlFor="showNewPassword" style={{ fontSize: "0.9rem" }}>
    Afficher le mot de passe
  </label>
</Box>

  </DialogContent>

  <DialogActions sx={{ mt: 2, justifyContent: "space-between", px: 2 }}>
 <Button
  onClick={() => setForgotOpen(false)}
  variant="contained"
  sx={{
    bgcolor: "#d32f2f",
    "&:hover": {
      bgcolor: "#b71c1c",
    },
  }}
>
  Annuler
</Button>

    <Button
      onClick={handlePasswordReset}
      variant="contained"
      sx={{ bgcolor: "#16a34a", "&:hover": { bgcolor: "#139442ff" } }}
    >
      Réinitialiser
    </Button>
  </DialogActions>
</Dialog>
    </Box>
  );
}