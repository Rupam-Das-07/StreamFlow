"use client";

import React, { createContext, useContext, useState } from 'react';

interface PlaylistContextType {
  refreshPlaylists: () => void;
  setRefreshTrigger: (trigger: number) => void;
  refreshTrigger: number;
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined);

export const usePlaylist = () => {
  const context = useContext(PlaylistContext);
  if (context === undefined) {
    throw new Error('usePlaylist must be used within a PlaylistProvider');
  }
  return context;
};

interface PlaylistProviderProps {
  children: React.ReactNode;
}

export const PlaylistProvider: React.FC<PlaylistProviderProps> = ({ children }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshPlaylists = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const value: PlaylistContextType = {
    refreshPlaylists,
    setRefreshTrigger,
    refreshTrigger,
  };

  return (
    <PlaylistContext.Provider value={value}>
      {children}
    </PlaylistContext.Provider>
  );
};
