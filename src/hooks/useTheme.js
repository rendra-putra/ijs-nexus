// hooks/useTheme.js
import { useState, useEffect } from 'react';

export const useTheme = () => {
  const isDark = false;

  useEffect(() => {
    localStorage.setItem('theme', 'light');
    document.body.setAttribute('data-theme', 'light');
  }, []);

  const toggleTheme = () => {};

  return { isDark, toggleTheme };
};
