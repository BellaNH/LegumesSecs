import React, { useEffect, useState } from 'react'; 
import axios from 'axios';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { useGlobalContext } from '../../context';
const Espece = () => {
  const [newEspece, setNewEspece] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const {especes, setEspeces,url,fetchEspeces} = useGlobalContext()

  const handleAdd = async () => {
    console.log(newEspece)
    if (!newEspece) return;
     newEspece.trim().toLowerCase();
    try {
      const response = await axios.post(`${url}/api/espece/`,
        { nom: newEspece },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response.data)
      setNewEspece('');
      fetchEspeces()
    } catch (error) {
      console.error("Erreur lors de l’ajout d'un espece", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${url}/api/espece/${id}/`,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      if (response.status === 204) {
        setEspeces(especes.filter((wilaya) => wilaya.id !== id));
        console.log("✔️ Espece supprimée avec succès");
      } else {
        console.error("❌ Erreur lors de la suppression :", response);
      }
    } catch (error) {
      console.error("Erreur côté client :", error.response?.data || error.message);
    }
  };  
  
  const handleEdit = (espece) => {
    setEditingId(espece.id);
    setEditingName(espece.nom);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `${url}/api/espece/${editingId}/`,
        { nom: editingName },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setEditingId(null);
      setEditingName('');
      fetchEspeces()
    } catch (error) {
      console.error('Erreur lors de la mise à jour', error);
    }
  };

  return (
    <div
      className="p-8 min-h-screen"
      style={{
        backgroundColor: '#f7f7f7', // Couleur de fond globale
        margin: '0', // Pour gérer les marges globales si besoin
      }}
    >
      <div
        className="max-w-3xl mx-auto"
        style={{
          backgroundColor: 'white', // Fond du box
          padding: '30px', // Espacement interne
          borderRadius: '1rem', // Coins arrondis
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', // Ombre douce
          marginTop: '20px', // Espace entre le haut et le box
        }}
      >
        <h2
          className="text-2xl font-bold text-center"
          style={{
            color: '#2D3748', // Couleur du titre
            marginBottom: '20px', // Marge inférieure du titre
          }}
        >
          📍 Liste des Especes
        </h2>
  
        {/* Champ d’ajout */}
        <div
          className="mb-6 flex gap-2"
          style={{
            marginBottom: '30px', // Espacement entre le champ et le tableau
          }}
        >
          <input
            type="text"
            placeholder="Nouveau Espece"
            value={newEspece}
            onChange={(e) => setNewEspece(e.target.value)}
            className="flex-1 border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            style={{
              padding: '10px', // Padding interne de l'input
              fontSize: '16px', // Taille de police
            }}
          />
          <button
            onClick={handleAdd}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
            style={{
              padding: '12px 24px', // Espacement interne du bouton
              fontSize: '16px', // Taille de la police
            }}
          >
            Ajouter
          </button>
        </div>
  
        {/* Tableau des wilayas */}
        {especes.length === 0 ? (
          <p
            className="text-center text-gray-500"
            style={{
              fontSize: '18px', // Taille du texte
              fontStyle: 'italic', // Style de police italique
            }}
          >
            Aucun Espece disponible.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table
              className="min-w-full text-left border border-gray-200 rounded-lg overflow-hidden"
              style={{
                width: '100%', // S'assure que le tableau prend toute la largeur disponible
                borderCollapse: 'collapse', // Assure la bonne gestion des bordures
              }}
            >
              <thead className="bg-gray-100">
                <tr>
                  <th
                    className="px-4 py-3 border-b"
                    style={{
                      fontSize: '25px', // Taille de la police des titres
                      fontWeight: 'bold', // Poids de la police
                      color: '#4A5568', // Couleur du texte
                    }}
                  >
                    Nom
                  </th>
                  <th
                    className="px-4 py-3 border-b text-right"
                    style={{
                      fontSize: '25px',
                      fontWeight: 'bold',
                      color: '#4A5568',
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {especes.map((espece) => (
                  <tr
                    key={espece.id}
                    className="hover:bg-gray-50"
                    style={{
                      transition: 'background-color 0.3s ease', // Effet au survol
                    }}
                  >
                    <td
                      className="px-4 py-3 border-b"
                      style={{
                        paddingLeft: '18px', // Contrôle des espacements
                        paddingRight: '16px',
                        fontSize: '20px',
                      }}
                    >
                      {editingId === espece.id ? (
                        <input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="w-full border border-gray-300 rounded px-2 py-1"
                          style={{
                            fontSize: '16px', // Taille de la police de l'input
                          }}
                        />
                      ) : (
                        espece.nom
                      )}
                    </td>
                    <td
                      className="px-4 py-3 border-b text-right"
                      style={{
                        paddingLeft: '18px', // Ajuste le padding de la colonne des actions
                        paddingRight: '16px',
                      }}
                    >
                      {editingId === espece.id ? (
                        <button
                          onClick={handleUpdate}
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
                            onClick={() => handleEdit(espece)}
                            className="text-blue-600 hover:text-blue-800 mr-4"
                            style={{
                              fontSize: '18px', // Taille de la police des icônes
                            }}
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(espece.id)}
                            className="text-red-600 hover:text-red-800"
                            style={{
                              fontSize: '18px', // Taille de la police des icônes
                            }}
                          >
                            <FaTrash />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Espece;