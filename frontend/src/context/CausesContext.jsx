import React, { createContext, useContext, useEffect, useState } from 'react';
import { causesApi } from '../api';

const CausesContext = createContext();

export const CausesProvider = ({ children }) => {
  const [causes, setCauses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCauses = async () => {
    try {
      setLoading(true);
      const data = await causesApi.getCauses();
      setCauses(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to fetch causes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCauses();
  }, []);

  return (
    <CausesContext.Provider value={{ causes, loading, error, refetchCauses: fetchCauses }}>
      {children}
    </CausesContext.Provider>
  );
};

export const useCauses = () => useContext(CausesContext);
