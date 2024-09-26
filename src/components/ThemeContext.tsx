// src/contexts/ThemeContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';

// Define a interface para o contexto do tema
interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

// Cria o contexto com valor inicial
export const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleDarkMode: () => {},
});

// Provider para envolver a aplicação
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (storedTheme) {
      setIsDarkMode(storedTheme === 'dark');
      document.body.classList.toggle('dark', storedTheme === 'dark');
    } else {
      setIsDarkMode(prefersDark);
      document.body.classList.toggle('dark', prefersDark);
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
    document.body.classList.toggle('dark', !isDarkMode);
    localStorage.setItem('theme', !isDarkMode ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
