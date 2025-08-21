import axios from 'axios';

const baseUrl = 'https://legumessecs.onrender.com/';

const AxiosInstance = axios.create({
    baseURL: baseUrl,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    }
});

// Fonction pour le login
export const login = async (username, password) => {
    try {
        const response = await AxiosInstance.post('api/login/', { username, password });
        return response.data;  // Retourne le token si la connexion réussit
    } catch (error) {
        throw error.response ? error.response.data : { error: "Une erreur est survenue" };
    }
};

// Fonction d'inscription
export const register = async (data) => {
    try {
      const response = await AxiosInstance.post('api/create-user/', data);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { error: "Une erreur est survenue" };
    }
  };
  

// 🔒 Fonction pour supprimer un utilisateur avec le token d'authentification
export const DeleteUser = async (userId) => {
    const token = localStorage.getItem("token");
    try {
        const response = await AxiosInstance.delete(`api/delete-user/${userId}/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { error: "Erreur de suppression" };
    }
};

export default AxiosInstance;
