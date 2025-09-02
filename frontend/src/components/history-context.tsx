"use client";

import React, { createContext, useContext, useState } from 'react';

interface HistoryContextType {
  refreshHistory: () => void;
  setRefreshTrigger: (trigger: number) => void;
  refreshTrigger: number;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
};

interface HistoryProviderProps {
  children: React.ReactNode;
}

export const HistoryProvider: React.FC<HistoryProviderProps> = ({ children }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshHistory = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const value: HistoryContextType = {
    refreshHistory,
    setRefreshTrigger,
    refreshTrigger,
  };

  return (
    <HistoryContext.Provider value={value}>
      {children}
    </HistoryContext.Provider>
  );
};

