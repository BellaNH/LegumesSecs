export const buildQueryParams = (params) => {
  const filtered = Object.entries(params).filter(([_, value]) => 
    value !== null && value !== undefined && value !== ''
  );
  
  if (filtered.length === 0) return {};
  
  return Object.fromEntries(filtered);
};

export const handleApiError = (error, defaultMessage = "Une erreur est survenue") => {
  if (error.response?.data?.error?.message) {
    return error.response.data.error.message;
  }
  
  if (error.response?.data?.error) {
    return typeof error.response.data.error === 'string' 
      ? error.response.data.error 
      : error.response.data.error.message || defaultMessage;
  }
  
  if (error.response?.data?.detail) {
    return error.response.data.detail;
  }
  
  if (error.message) {
    return error.message;
  }
  
  return defaultMessage;
};

export const getErrorMessage = (error) => {
  return handleApiError(error);
};

export const getSuccessMessage = (action, resource = "élément") => {
  const messages = {
    create: `${resource} créé avec succès ✅`,
    update: `${resource} modifié avec succès ✅`,
    delete: `${resource} supprimé avec succès ✅`,
  };
  
  return messages[action] || `${action} réussi ✅`;
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
};

export const formatNumber = (number, decimals = 2) => {
  if (number === null || number === undefined) return '0';
  return Number(number).toFixed(decimals);
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const validateRequired = (value, fieldName = "Ce champ") => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} est requis`;
  }
  return null;
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Format d'email invalide";
  }
  return null;
};

export const validateMinLength = (value, minLength, fieldName = "Ce champ") => {
  if (value && value.length < minLength) {
    return `${fieldName} doit contenir au moins ${minLength} caractères`;
  }
  return null;
};









