import React, { useState } from "react";
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
import { useLanguage } from "../../i18n/LanguageContext";
import PageLoader from "../../components/common/PageLoader";

const AjouterCommunes = () => {
  const [nom, setNom] = useState("");
  const [subdivisionId, setSubdivisionId] = useState("");
  const {url,subdivisions,fetchCommunes,isDataLoading}= useGlobalContext()
  const { t } = useLanguage();
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
      await axios.post(
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
      setSuccessMessage(t('commune.added'));
      setOpenSuccess(true);
      fetchCommunes()
      navigate("/communes");
    } catch (error) {
      console.error("❌ [AJOUTER_COMMUNE] Error creating commune:", error);
      console.error("❌ [AJOUTER_COMMUNE] Error response:", error.response?.data);
      console.error("❌ [AJOUTER_COMMUNE] Error status:", error.response?.status);
      console.error("❌ [AJOUTER_COMMUNE] Full error:", error);
      
      const errorMsg = error.response?.data?.error?.message 
        || error.response?.data?.message 
        || error.response?.data?.detail
        || error.message 
        || t('commune.addError');
      
      setErrorMessage(errorMsg);
      setOpenError(true);
    }
  }
  };

  if (isDataLoading) {
    return <PageLoader />;
  }

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, mt: 5, borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom>
          {t('commune.formTitle')}
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label={t('commune.formName')}
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />
          <TextField
            select
            label={t('nav.subdivision')}
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
            {t('common.add')}
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
