'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { Theme } from '@/app/lib/theme';
import { themes } from '@/app/lib/theme';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  t: typeof themes.spatial;
  isFallout: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'spatial',
  setTheme: () => {},
  t: themes.spatial,
  isFallout: false,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('spatial');

  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme;
    if (saved && themes[saved]) setThemeState(saved);
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        t: themes[theme],
        isFallout: theme === 'fallout',
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
