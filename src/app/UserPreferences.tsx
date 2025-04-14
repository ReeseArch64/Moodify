// ------------------------------------------------
// 3. UserPreferences.tsx (Contexto de preferências do usuário)
// ------------------------------------------------
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserPreferencesContextProps {
  playHistory: string[];
  addToPlayHistory: (trackId: string) => void;
  favorites: string[];
  toggleFavorite: (trackId: string) => void;
}

const UserPreferencesContext = createContext<UserPreferencesContextProps | undefined>(undefined);

export const UserPreferencesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [playHistory, setPlayHistory] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // Carregar do localStorage quando o componente monta
  useEffect(() => {
    const savedPlayHistory = localStorage.getItem('play_history');
    const savedFavorites = localStorage.getItem('favorites');
    
    if (savedPlayHistory) {
      setPlayHistory(JSON.parse(savedPlayHistory));
    }
    
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);
  
  // Salvar no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem('play_history', JSON.stringify(playHistory));
  }, [playHistory]);
  
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);
  
  const addToPlayHistory = (trackId: string) => {
    // Adiciona ao início da lista e mantém apenas os últimos 10
    setPlayHistory(prev => {
      const withoutCurrent = prev.filter(id => id !== trackId);
      return [trackId, ...withoutCurrent].slice(0, 10);
    });
  };
  
  const toggleFavorite = (trackId: string) => {
    setFavorites(prev => 
      prev.includes(trackId)
        ? prev.filter(id => id !== trackId)
        : [...prev, trackId]
    );
  };
  
  return (
    <UserPreferencesContext.Provider 
      value={{
        playHistory,
        addToPlayHistory,
        favorites,
        toggleFavorite
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
};