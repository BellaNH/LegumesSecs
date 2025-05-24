import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  TextField
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import SearchIcon from '@mui/icons-material/Search'; // Assure-toi d'importer cette icône
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { useGlobalContext } from "../../context";
const SubdivisionManager = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const {url,fetchCommunes,communes,setCommunes,user}= useGlobalContext()
  const navigate = useNavigate()
  const [editingId, setEditingId] = useState(null)
  const [editedCommuneName, setEditedCommuneName] = useState('')


  const handleDelete = async (id) => {
    if (window.confirm("Supprimer cette commune ?")) {
      await axios.delete(`${url}/api/commune/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCommunes((prev) => prev.filter((s) => s.id !== id));
    }
  }

  const handleEdit = (commune) => {
    setEditingId(commune.id);
    setEditedCommuneName(commune.nom);
  };
  const handleUpdate = async (id) => {
    console.log(id)
    if(id){
      try {
        await axios.put(
          `${url}/api/commune/${editingId}/`,
          { nom: editedCommuneName,
            subdiv_id:id,
           },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setEditingId(null);
        setEditedCommuneName('');
        fetchCommunes()
      } catch (error) {
        console.error('Erreur lors de la mise à jour', error);
      }
    }
    };

return (
  <Box sx={{ display: "flex", justifyContent: "center", mt: 5, ml: 10 }}>
    <Box sx={{ width: "75%" }}>
      <Typography variant="h5" align="center" gutterBottom fontWeight="bold">
        Liste des Communes
      </Typography>
      <Button
          variant="contained"
          color="success"
          sx={{ mb: 2, mr: 2 }}
          onClick={() => navigate("/ajouter-commune")}
      >
        Ajouter
      </Button>

      {/* Barre de recherche stylisée */}
      <TextField
        label="Rechercher une Commune"
        variant="outlined"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)} 
        sx={{ 
          mb: 2, 
          width: "50%", 
          mr: 90, 
          borderRadius: 12, // ← bord arrondi, tu peux changer à 0 pour un look carré
          '& .MuiOutlinedInput-root': {
            borderRadius: 9, // ← ici aussi pour les bords internes
          }
        }}
        InputProps={{
          startAdornment: (
            <SearchIcon sx={{ mr: 1, color: "gray" }} />
          ),
        }}
      />

      <Paper elevation={3}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>Nom de la commune</strong></TableCell>
                <TableCell><strong>Subdivision</strong></TableCell>
                {user && user.permissions[8].update==="true" || user.permissions[8].delete==="true" &&
                
                <TableCell align="center"><strong>Actions</strong></TableCell>
                }
                
              </TableRow>
            </TableHead>
            <TableBody>
              {communes.map((com) => (
                <TableRow key={com.id}>
                  <TableCell>{com.id}</TableCell>
                  <TableCell
                                        className="px-4 py-3 border-b"
                                        style={{
                                          paddingLeft: '18px', // Contrôle des espacements
                                          paddingRight: '16px',
                                          fontSize: '20px',
                                        }}
                                      >
                                        {editingId === com.id ? (
                                          <input
                                            value={editedCommuneName}
                                            onChange={(e) => setEditedCommuneName(e.target.value)}
                                            className="w-full border border-gray-300 rounded px-2 py-1"
                                            style={{
                                              fontSize: '16px', // Taille de la police de l'input
                                            }}
                                          />
                                        ) : (
                                          com.nom
                                        )}
                                      </TableCell>
                  <TableCell>{com.subdivision.nom || "Aucune Communes"}</TableCell>
                  {(user.role.nom === "admin" ||
  user.permissions.find(p => p.model === "Commune" && (p.update === "true" || p.delete === "true"))) &&
                  
                  <TableCell align="center">
                    
                      {editingId === com.id ? (
                          <button
                              onClick={(e)=>handleUpdate(com.id)}
                              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mr-2"
                              style={{
                                fontSize: '16px', // Taille de la police du bouton
                              }}
                              >  
                              Valider
                          </button>
                           ) : (
                           <>
                      
                          <button
                            onClick={() => handleEdit(com)}
                            className="text-blue-600 hover:text-blue-800 mr-4"
                            style={{
                             fontSize: '18px', // Taille de la police des icônes
                            }}
                          >
                            <EditIcon />
                          </button>
                          {(user.role.nom === "admin" ||
  user.permissions?.find(p => p.model === "Commune" &&  p.delete === "true")) &&
                          <button
                            onClick={() => handleDelete(com.id)}
                            className="text-red-600 hover:text-red-800"
                            style={{
                            fontSize: '18px', // Taille de la police des icônes
                            }}
                            >
                          <DeleteIcon />
                          </button>
}
                          </>
                          )}
                                      
                          </TableCell>
                          }
                  
                </TableRow>
              ))}
              {communes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    Aucune communes trouvée.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  </Box>
);

  
};

export default SubdivisionManager;