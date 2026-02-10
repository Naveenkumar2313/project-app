
import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  highContrast: boolean;
  toggleHighContrast: () => void;
  fontSize: 'normal' | 'large';
  toggleFontSize: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');

  useEffect(() => {
    const savedContrast = localStorage.getItem('a11y_contrast') === 'true';
    const savedSize = localStorage.getItem('a11y_size') as 'normal' | 'large' || 'normal';
    setHighContrast(savedContrast);
    setFontSize(savedSize);
  }, []);

  useEffect(() => {
    localStorage.setItem('a11y_contrast', String(highContrast));
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [highContrast]);

  useEffect(() => {
    localStorage.setItem('a11y_size', fontSize);
    if (fontSize === 'large') {
      document.documentElement.style.fontSize = '120%'; // Scale root font size
    } else {
      document.documentElement.style.fontSize = '100%';
    }
  }, [fontSize]);

  const toggleHighContrast = () => setHighContrast(prev => !prev);
  const toggleFontSize = () => setFontSize(prev => prev === 'normal' ? 'large' : 'normal');

  return (
    <ThemeContext.Provider value={{ highContrast, toggleHighContrast, fontSize, toggleFontSize }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
