let accessToken = null;

export const getAccessToken = () => accessToken || localStorage.getItem('token');

export const setAccessToken = (token) => {
  accessToken = token;
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

export const clearAccessToken = () => {
  accessToken = null;
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
};
