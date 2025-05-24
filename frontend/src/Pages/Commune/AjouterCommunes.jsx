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

const AjouterCommunes = () => {
  const [nom, setNom] = useState("");
  const [subdivisionId, setSubdivisionId] = useState("");
  const {url,subdivisions,fetchCommunes,communes,setCommunes}= useGlobalContext()
  const navigate = useNavigate();

  

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
      fetchCommunes()
      navigate("/communes");
    } catch (error) {
      console.error("Erreur lors de l'ajout de la commune :", error);
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
    </Container>
  );
};

export default AjouterCommunes;