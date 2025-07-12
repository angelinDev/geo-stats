'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark'); // Défaut : thème sombre
  const [mounted, setMounted] = useState(false);

  // Charger le thème depuis localStorage au démarrage (force le thème sombre)
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as Theme;
    
    // Force toujours le thème sombre
    setTheme('dark');
    console.log('� Application en mode sombre uniquement');
  }, []);

  // Sauvegarder le thème dans localStorage et appliquer la classe
  useEffect(() => {
    if (!mounted) return;
    
    console.log('🎨 Application du thème sombre');
    localStorage.setItem('theme', 'dark');
    
    // Force toujours la classe dark
    const htmlElement = document.documentElement;
    htmlElement.classList.remove('light');
    htmlElement.classList.add('dark');
    console.log('✅ Classe dark appliquée');
  }, [mounted]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
