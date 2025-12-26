import React, { useState } from 'react';
import {
  TextField,
  FormControl,
  FormLabel,
  FormHelperText,
  InputAdornment,
  IconButton,
  Box,
  Typography,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const FormField = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  type = 'text',
  required = false,
  disabled = false,
  fullWidth = true,
  multiline = false,
  rows = 1,
  maxLength,
  showCharCount = false,
  placeholder,
  startAdornment,
  endAdornment,
  sx = {},
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;
  const currentLength = value?.toString().length || 0;
  const showCounter = showCharCount && maxLength;

  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = (e) => {
    setFocused(false);
    if (onBlur) {
      onBlur(e);
    }
  };

  return (
    <FormControl
      fullWidth={fullWidth}
      error={!!error}
      required={required}
      disabled={disabled}
      sx={sx}
    >
      {label && (
        <FormLabel sx={{ mb: 1 }}>
          {label}
          {required && <span style={{ color: 'red' }}> *</span>}
        </FormLabel>
      )}
      
      <TextField
        name={name}
        value={value || ''}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        type={inputType}
        error={!!error}
        helperText={error || helperText}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        fullWidth={fullWidth}
        multiline={multiline}
        rows={rows}
        inputProps={{
          maxLength: maxLength,
          ...props.inputProps,
        }}
        InputProps={{
          startAdornment: startAdornment ? (
            <InputAdornment position="start">{startAdornment}</InputAdornment>
          ) : null,
          endAdornment: isPassword ? (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ) : endAdornment ? (
            <InputAdornment position="end">{endAdornment}</InputAdornment>
          ) : null,
          ...props.InputProps,
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: '#16a34a',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#16a34a',
            },
          },
          ...props.sx,
        }}
        {...props}
      />
      
      {showCounter && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5 }}>
          <Typography
            variant="caption"
            color={currentLength > maxLength * 0.9 ? 'warning.main' : 'text.secondary'}
          >
            {currentLength} / {maxLength}
          </Typography>
        </Box>
      )}
    </FormControl>
  );
};

export default FormField;


















