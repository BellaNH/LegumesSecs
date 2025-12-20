import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@mui/material';
import { useGlobalContext } from '../../context';
import useLocationFilter from '../../hooks/useLocationFilter';

const LocationFilter = ({ 
  onFilterChange, 
  disabled = false,
  showTitle = true,
  title = "Filtrage par localisation",
  userWilayaId = null,
  className = ""
}) => {
  const { wilayas, user } = useGlobalContext();
  const {
    selectedWilaya,
    selectedSubdiv,
    selectedCommune,
    filteredSubdiv,
    filteredCommune,
    handleWilayaChange,
    handleSubdivChange,
    handleCommuneChange,
  } = useLocationFilter(onFilterChange);

  const currentWilaya = userWilayaId || 
    (user?.role?.nom === "agent_dsa" || user?.role?.nom === "agent_subdivision" 
      ? user?.wilaya?.id 
      : selectedWilaya);

  const isWilayaDisabled = disabled || !!userWilayaId || 
    user?.role?.nom === "agent_dsa" || user?.role?.nom === "agent_subdivision";

  return (
    <Box className={className}>
      {showTitle && (
        <h3 className="text-3xl font-bold text-left text-green-600 mt-2 mb-6">
          {title}
        </h3>
      )}
      <Box
        sx={{
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          background: "rgba(255, 255, 255, 0.3)",
          borderRadius: "8px",
          marginBottom: "48px",
          display: "flex",
          justifyContent: "space-between",
          padding: "24px 32px",
          border: "1px solid #16a34a",
        }}
      >
        <FormControl size="small" sx={{ width: "30%" }} variant="outlined">
          <InputLabel id="wilaya-label">Wilaya</InputLabel>
          {wilayas.length > 0 && (
            <Select
              disabled={isWilayaDisabled}
              name="wilaya"
              labelId="wilaya-label"
              sx={{ backgroundColor: "white", borderRadius: "4px" }}
              onChange={(e) => handleWilayaChange(e.target.value)}
              value={currentWilaya || ""}
              label="Wilaya"
              aria-label="Sélectionner une wilaya"
            >
              <MenuItem value="">
                <em>Aucune</em>
              </MenuItem>
              {wilayas.map((wilaya) => (
                <MenuItem key={wilaya.id} value={wilaya.id}>
                  {wilaya.nom}
                </MenuItem>
              ))}
            </Select>
          )}
        </FormControl>

        <FormControl size="small" sx={{ width: "30%" }} variant="outlined">
          <InputLabel id="subdivision-label">Subdivision</InputLabel>
          <Select
            disabled={disabled || !selectedWilaya}
            name="subdiv"
            labelId="subdivision-label"
            sx={{ backgroundColor: "white", borderRadius: "4px" }}
            onChange={(e) => handleSubdivChange(e.target.value)}
            value={selectedSubdiv || ""}
            label="Subdivision"
            aria-label="Sélectionner une subdivision"
          >
            <MenuItem value="">
              <em>Aucune</em>
            </MenuItem>
            {filteredSubdiv.map((subdiv) => (
              <MenuItem key={subdiv.id} value={subdiv.id}>
                {subdiv.nom}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ width: "30%" }} variant="outlined">
          <InputLabel id="commune-label">Commune</InputLabel>
          <Select
            disabled={disabled || (!selectedWilaya && !selectedSubdiv)}
            name="commune"
            labelId="commune-label"
            sx={{ backgroundColor: "white", borderRadius: "4px" }}
            onChange={(e) => handleCommuneChange(e.target.value)}
            value={selectedCommune || ""}
            label="Commune"
            aria-label="Sélectionner une commune"
          >
            <MenuItem value="">
              <em>Aucune</em>
            </MenuItem>
            {filteredCommune.map((commune) => (
              <MenuItem key={commune.id} value={commune.id}>
                {commune.nom}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

export default LocationFilter;

