import { useState, useCallback } from 'react';
import { locationService } from '../services/api';

export const useLocationFilter = (onFilterChange = null) => {
  const [selectedWilaya, setSelectedWilaya] = useState('');
  const [selectedSubdiv, setSelectedSubdiv] = useState('');
  const [selectedCommune, setSelectedCommune] = useState('');
  const [filteredSubdiv, setFilteredSubdiv] = useState([]);
  const [filteredCommune, setFilteredCommune] = useState([]);

  const filterSubdivByWilaya = useCallback(async (wilayaId) => {
    if (!wilayaId) {
      setFilteredSubdiv([]);
      setFilteredCommune([]);
      return;
    }

    try {
      const data = await locationService.getSubdivisionsByWilaya(wilayaId);
      setFilteredSubdiv(data);
      setFilteredCommune([]);
      setSelectedSubdiv('');
      setSelectedCommune('');
    } catch (error) {
      setFilteredSubdiv([]);
    }
  }, []);

  const filterCommuneByWilaya = useCallback(async (wilayaId) => {
    if (!wilayaId) {
      setFilteredCommune([]);
      return;
    }

    try {
      const data = await locationService.getCommunesByWilaya(wilayaId);
      setFilteredCommune(data);
      setSelectedCommune('');
    } catch (error) {
      setFilteredCommune([]);
    }
  }, []);

  const filterCommuneBySubdiv = useCallback(async (subdivId) => {
    if (!subdivId) {
      setFilteredCommune([]);
      return;
    }

    try {
      const data = await locationService.getCommunesBySubdivision(subdivId);
      setFilteredCommune(data);
      setSelectedCommune('');
    } catch (error) {
      setFilteredCommune([]);
    }
  }, []);

  const handleWilayaChange = useCallback(async (wilayaId) => {
    setSelectedWilaya(wilayaId || '');
    await filterSubdivByWilaya(wilayaId);
    await filterCommuneByWilaya(wilayaId);
    
    if (onFilterChange) {
      onFilterChange({ wilaya: wilayaId, subdivision: null, commune: null });
    }
  }, [filterSubdivByWilaya, filterCommuneByWilaya, onFilterChange]);

  const handleSubdivChange = useCallback(async (subdivId) => {
    setSelectedSubdiv(subdivId || '');
    await filterCommuneBySubdiv(subdivId);
    
    if (onFilterChange) {
      onFilterChange({ 
        wilaya: selectedWilaya, 
        subdivision: subdivId, 
        commune: null 
      });
    }
  }, [filterCommuneBySubdiv, selectedWilaya, onFilterChange]);

  const handleCommuneChange = useCallback((communeId) => {
    setSelectedCommune(communeId || '');
    
    if (onFilterChange) {
      onFilterChange({ 
        wilaya: selectedWilaya, 
        subdivision: selectedSubdiv, 
        commune: communeId 
      });
    }
  }, [selectedWilaya, selectedSubdiv, onFilterChange]);

  const resetFilters = useCallback(() => {
    setSelectedWilaya('');
    setSelectedSubdiv('');
    setSelectedCommune('');
    setFilteredSubdiv([]);
    setFilteredCommune([]);
    
    if (onFilterChange) {
      onFilterChange({ wilaya: null, subdivision: null, commune: null });
    }
  }, [onFilterChange]);

  return {
    selectedWilaya,
    selectedSubdiv,
    selectedCommune,
    filteredSubdiv,
    filteredCommune,
    handleWilayaChange,
    handleSubdivChange,
    handleCommuneChange,
    resetFilters,
    setSelectedWilaya,
    setSelectedSubdiv,
    setSelectedCommune,
  };
};

export default useLocationFilter;









