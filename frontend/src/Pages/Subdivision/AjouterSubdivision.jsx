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
const AjouterSubdivision = () => {
  const [nom, setNom] = useState("");
  const [wilayaId, setWilayaId] = useState("");
  const navigate = useNavigate();
  const {wilayas,url,fetchSubdivisions} = useGlobalContext()
      const [errorMessage, setErrorMessage] = useState(""); 
    const [successMessage, setSuccessMessage] = useState(""); 
    const [openError, setOpenError] = useState(false);
    const [openSuccess, setOpenSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(wilayaId){
    try {
      console.log({ nom, wilaya: wilayaId });
      const response =  await axios.post(
        `${url}/api/subdivision/`,
        {
          nom: nom,
          wilaya_id: wilayaId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSuccessMessage(`Subdivision est ajoutée avec succès ✅`);
      setOpenSuccess(true);
      fetchSubdivisions()
      navigate("/subdivisions");
    } catch (error) {
      setErrorMessage("Erreur lors de l'ajout de la subdivision");
      setOpenError(true)
    }
  }
  };
  useEffect(()=>{console.log(wilayaId)},[wilayaId])
  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, mt: 5, borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom>
          Ajouter une nouvelle subdivision
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Nom de la subdivision"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />
          <TextField
            select
            label="Wilaya"
            value={wilayaId}
            onChange={(e) => setWilayaId(e.target.value)}
            required
          >
            {wilayas.map((w) => (
              <MenuItem key={w.id} value={w.id}>
                {w.nom}
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

export default AjouterSubdivision;
