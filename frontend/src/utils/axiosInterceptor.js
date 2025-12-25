import axios from 'axios';

const setupAxiosInterceptors = (refreshAccessToken, logout) => {
  const baseUrl = 'https://legumessecs.onrender.com';

  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token && config.url?.includes(baseUrl)) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const newToken = await refreshAccessToken();
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return axios(originalRequest);
          }
        } catch (refreshError) {
          logout();
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};

export default setupAxiosInterceptors;

















