export const validateEmail = (email) => {
  if (!email) {
    return "L'email est requis";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Format d'email invalide";
  }
  return null;
};

export const validateRequired = (value, fieldName = "Ce champ") => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} est requis`;
  }
  return null;
};

export const validateMinLength = (value, minLength, fieldName = "Ce champ") => {
  if (value && value.length < minLength) {
    return `${fieldName} doit contenir au moins ${minLength} caractères`;
  }
  return null;
};

export const validateMaxLength = (value, maxLength, fieldName = "Ce champ") => {
  if (value && value.length > maxLength) {
    return `${fieldName} ne doit pas dépasser ${maxLength} caractères`;
  }
  return null;
};

export const validatePhoneNumber = (phone) => {
  if (!phone) {
    return "Le numéro de téléphone est requis";
  }
  const phoneRegex = /^[0-9]{9,10}$/;
  if (!phoneRegex.test(phone.toString())) {
    return "Numéro de téléphone invalide (9-10 chiffres)";
  }
  return null;
};

export const validatePositiveNumber = (value, fieldName = "Ce champ") => {
  if (value === null || value === undefined || value === '') {
    return `${fieldName} est requis`;
  }
  const num = Number(value);
  if (isNaN(num) || num <= 0) {
    return `${fieldName} doit être un nombre positif`;
  }
  return null;
};

export const validateDecimal = (value, min = null, max = null, fieldName = "Ce champ") => {
  if (value === null || value === undefined || value === '') {
    return `${fieldName} est requis`;
  }
  const num = Number(value);
  if (isNaN(num)) {
    return `${fieldName} doit être un nombre`;
  }
  if (min !== null && num < min) {
    return `${fieldName} doit être au moins ${min}`;
  }
  if (max !== null && num > max) {
    return `${fieldName} ne doit pas dépasser ${max}`;
  }
  return null;
};

export const validateYear = (year) => {
  if (!year) {
    return "L'année est requise";
  }
  const currentYear = new Date().getFullYear();
  const yearNum = Number(year);
  if (isNaN(yearNum) || yearNum < 2000 || yearNum > currentYear + 1) {
    return `L'année doit être entre 2000 et ${currentYear + 1}`;
  }
  return null;
};

export const validatePassword = (password) => {
  if (!password) {
    return "Le mot de passe est requis";
  }
  if (password.length < 8) {
    return "Le mot de passe doit contenir au moins 8 caractères";
  }
  return null;
};

export const validateLatitude = (lat) => {
  if (lat === null || lat === undefined || lat === '') {
    return "La latitude est requise";
  }
  const num = Number(lat);
  if (isNaN(num) || num < -90 || num > 90) {
    return "La latitude doit être entre -90 et 90";
  }
  return null;
};

export const validateLongitude = (lng) => {
  if (lng === null || lng === undefined || lng === '') {
    return "La longitude est requise";
  }
  const num = Number(lng);
  if (isNaN(num) || num < -180 || num > 180) {
    return "La longitude doit être entre -180 et 180";
  }
  return null;
};

export const validateForm = (values, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach((field) => {
    const fieldRules = rules[field];
    const value = values[field];
    
    for (const rule of fieldRules) {
      const error = rule(value, field);
      if (error) {
        errors[field] = error;
        break;
      }
    }
  });
  
  return errors;
};

export default {
  validateEmail,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validatePhoneNumber,
  validatePositiveNumber,
  validateDecimal,
  validateYear,
  validatePassword,
  validateLatitude,
  validateLongitude,
  validateForm,
};
















