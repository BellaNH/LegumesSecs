import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { useGlobalContext } from "../context"

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [welcomeMsg,setWelcomeMsg] =useState("")
  const navigate = useNavigate();
  const {login,user, setUser,setIsAuthenticated,url} = useGlobalContext()

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Appel à l'API pour obtenir les tokens
      const response = await axios.post(`${url}/api/token/`, {
        email,
        password,
      });
      const { access, refresh } = response.data;  // Récupérer le token d'accès
      console.log(access)
      await login(access)
      setTimeout(() => {
        navigate("/dashboard")
      }, 1500);
}
    catch (error) {
      console.error("Erreur lors de la connexion :", error);
      alert("Identifiants invalides");
    }
  };

  return (
  <>
    <Box sx={{ maxWidth: 400, height:350, mx: "auto", mt: 10, p: 3, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h5" textAlign="center" mb={2}>
        Connexion
      </Typography>

      <form onSubmit={handleLogin}>
        <TextField
          fullWidth
          label="Email"
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
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button fullWidth variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
          Se connecter
        </Button>
      </form>
      </Box>
      
    
   </>
  );
}