import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Container,
  Paper,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../context";
const AjouterSubdivision = () => {
  const [nom, setNom] = useState("");
  const [wilayaId, setWilayaId] = useState("");
  const navigate = useNavigate();
  const {wilayas,url,fetchSubdivisions} = useGlobalContext()
  

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
   
      fetchSubdivisions()
      navigate("/subdivisions");
    } catch (error) {
      console.error("Erreur lors de l'ajout de la subdivision :", error);
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
    </Container>
  );
};

export default AjouterSubdivision;
