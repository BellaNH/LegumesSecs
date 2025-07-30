import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Container,
  Paper,
  Snackbar, 
  Alert
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../context";

const AjouterCommunes = () => {
  const [nom, setNom] = useState("");
  const [subdivisionId, setSubdivisionId] = useState("");
  const {url,subdivisions,fetchCommunes,communes,setCommunes}= useGlobalContext()
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(""); 
    const [successMessage, setSuccessMessage] = useState(""); 
    const [openError, setOpenError] = useState(false);
    const [openSuccess, setOpenSuccess] = useState(false);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(subdivisionId){
    try {
      const token = localStorage.getItem("token");
      const response =  await axios.post(
        `${url}/api/commune/`,
        {
          nom: nom,
          subdiv_id: subdivisionId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data)
      setSuccessMessage(`Commune est ajouté avec succès ✅`);
      setOpenSuccess(true);
      fetchCommunes()
      navigate("/communes");
    } catch (error) {
      setErrorMessage("Erreur lors de l'ajout de la commune");
      setOpenError(true);
    }
  }
  };
  useEffect(()=>{console.log(subdivisionId)},[subdivisionId])
  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, mt: 5, borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom>
          Ajouter une nouvelle commune
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Nom de la commune"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />
          <TextField
            select
            label="Subdivision"
            value={subdivisionId}
            onChange={(e) => setSubdivisionId(e.target.value)}
            required
          >
            {subdivisions.map((s) => (
              <MenuItem key={s.id} value={s.id}>
                {s.nom}
              </MenuItem>
            ))}
          </TextField>
          <Button variant="contained" color="success" type="submit">
            Ajouter
          </Button>
        </Box>
      </Paper>

                           <Snackbar open={openSuccess} autoHideDuration={4000} onClose={()=>setOpenSuccess(false)}>
                              <Alert onClose={()=>setOpenSuccess(false)} severity="success" sx={{ width: "100%" }}>
                                {successMessage}
                              </Alert>
                            </Snackbar>
                
                              <Snackbar open={openError} autoHideDuration={4000} onClose={() => setOpenError(false)}>
                                <Alert onClose={() => setOpenError(false)} severity="error" sx={{ width: "100%" }}>
                                  {errorMessage}
                                </Alert>
                              </Snackbar>
    </Container>
  );
};

export default AjouterCommunes;