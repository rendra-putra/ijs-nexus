/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext } from 'react';
import { useTheme } from '../hooks/useTheme';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for easy access
export const useThemeContext = () => useContext(ThemeContext);
