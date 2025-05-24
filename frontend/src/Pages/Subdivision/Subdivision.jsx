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
import { FaTrash, FaEdit } from 'react-icons/fa';
const SubdivisionManager = () => {

  const {url,user,fetchSubdivisions,searchQuery, setSearchQuery,subdivisions,setSubdivisions} = useGlobalContext()
  const navigate = useNavigate();
  const [editingId, setEditingId] = useState(null);
  const [editedSubdivName, setEditedSubdivName] = useState('');

  const [subdiv,setSubdiv] = useState({})
  const handleChange = (e)=>{
    const {name,value} = e.target
    setSubdiv({
      ...subdiv,
      [name]:value
    })
  }
  const handleEdit = (subdivision) => {
    setEditingId(subdivision.id);
    setEditedSubdivName(subdivision.nom);
  };
  const handleUpdate = async (id) => {
    console.log(id)
    if(id){
      try {
        await axios.put(
          `${url}/api/subdivision/${editingId}/`,
          { nom: editedSubdivName,
            wilaya_id:id,
           },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setEditingId(null);
        setEditedSubdivName('');
        fetchSubdivisions()
      } catch (error) {
        console.error('Erreur lors de la mise à jour', error);
      }
    }
    };
  const handleDelete = async (id) => {
    if (window.confirm("Supprimer cette subdivision ?")) {
      await axios.delete(`${url}/api/subdivision/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchSubdivisions()
      setSubdivisions((prev) => prev.filter((s) => s.id !== id));
    }
  };

return (
  <Box sx={{ display: "flex", justifyContent: "center", mt: 5, ml: 10 }}>
    <Box sx={{ width: "100%" ,display:"flex",flexDirection:"column"}}>
      <Typography variant="h5" align="center" gutterBottom fontWeight="bold">
        Liste des Subdivisions
      </Typography>
      
      {/* Barre de recherche stylisée */}
      <TextField
        size="small"
        label="Rechercher une subdivision"
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
      {user.permissions[6].create==="true" &&
      
      <Button
          variant="contained"
          color="success"
          sx={{ mb: 2, mr: 2 }}
          onClick={() => navigate("/ajouter-subdivision")}
      >
        Ajouter
      </Button>
      }
      
   
     

      <Paper elevation={3}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>Nom de la subdivision</strong></TableCell>
                <TableCell><strong>Wilaya</strong></TableCell>
                {user.permissions[6].update==="true" || user.permissions[8].delete==="true" &&
                
                <TableCell align="center"><strong>Actions</strong></TableCell>}
                
              </TableRow>
            </TableHead>
            <TableBody>
              {subdivisions.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell>{sub.id}</TableCell>
                  <TableCell
                      className="px-4 py-3 border-b"
                      style={{
                        paddingLeft: '18px', // Contrôle des espacements
                        paddingRight: '16px',
                        fontSize: '20px',
                      }}
                    >
                      {editingId === sub.id ? (
                        <input
                          value={editedSubdivName}
                          onChange={(e) => setEditedSubdivName(e.target.value)}
                          className="w-full border border-gray-300 rounded px-2 py-1"
                          style={{
                            fontSize: '16px', // Taille de la police de l'input
                          }}
                        />
                      ) : (
                        sub.nom
                      )}
                    </TableCell>
                  <TableCell
                      className="px-4 py-3 border-b"
                      style={{
                        paddingLeft: '18px', // Contrôle des espacements
                        paddingRight: '16px',
                        fontSize: '20px',
                      }}
                    >
                      {sub.wilaya.nom}
                      
                    </TableCell>
              {user.permissions[6].update==="true" || user.permissions[8].delete==="true" &&
              
               <TableCell align="center">
                    {editingId === sub.id ? (
                                            <button
                                              onClick={(e)=>handleUpdate(sub.wilaya.id)}
                                              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mr-2"
                                              style={{
                                                fontSize: '16px', // Taille de la police du bouton
                                              }}
                                            >
                                              Valider
                                            </button>
                                          ) : (
                                            <>
                                            {user.permissions[6].update==="true" &&
                                            
                                            <button
                                                onClick={() => handleEdit(sub)}
                                                className="text-blue-600 hover:text-blue-800 mr-4"
                                                style={{
                                                  fontSize: '18px', // Taille de la police des icônes
                                                }}
                                              >
                                                <FaEdit />
                                              </button>
                                              }
                                              {user.permissions[6].update==="true" &&
                                              <button
                                                onClick={() => handleDelete(sub.id)}
                                                className="text-red-600 hover:text-red-800"
                                                style={{
                                                  fontSize: '18px', // Taille de la police des icônes
                                                }}
                                              >
                                                <FaTrash />
                                              </button>
}
                                            </>
                                          )}
                    
                  </TableCell>
                  }
                 
                </TableRow>
              ))}
              {subdivisions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    Aucune subdivision trouvée.
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
