import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const THEME_STORAGE_KEY = 'echo_data_analyst_theme';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        return saved;
      }
    }
    return 'system';
  });

  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(getSystemTheme);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  const resolvedTheme: ResolvedTheme = useMemo(() => {
    if (theme === 'system') return systemTheme;
    return theme;
  }, [theme, systemTheme]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (resolvedTheme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  }, [resolvedTheme]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch {
      // ignore storage errors
    }
  };

  const toggleTheme = () => {
    if (resolvedTheme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

  const contextValue = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      toggleTheme,
    }),
    [theme, resolvedTheme]
  );

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export const ThemeToggle: React.FC<{ className?: string; showLabel?: boolean }> = ({
  className = '',
  showLabel = false,
}) => {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();

  return (
    <div className={`inline-flex items-center rounded-xl bg-white border border-neutral-200 p-0.5 shadow-xs transition ${className}`}>
      <button
        type="button"
        onClick={() => setTheme('light')}
        className={`relative flex items-center justify-center rounded-lg p-1.5 text-xs transition cursor-pointer ${
          theme === 'light'
            ? 'bg-neutral-100 text-amber-600 font-semibold shadow-2xs'
            : 'text-neutral-500 hover:text-neutral-900'
        }`}
        title="Light mode"
        aria-label="Light mode"
      >
        <Sun className="h-3.5 w-3.5" />
        {showLabel && <span className="ml-1 text-[11px]">Light</span>}
      </button>

      <button
        type="button"
        onClick={() => setTheme('dark')}
        className={`relative flex items-center justify-center rounded-lg p-1.5 text-xs transition cursor-pointer ${
          theme === 'dark'
            ? 'bg-neutral-800 text-blue-400 font-semibold shadow-2xs'
            : 'text-neutral-500 hover:text-neutral-900'
        }`}
        title="Dark mode"
        aria-label="Dark mode"
      >
        <Moon className="h-3.5 w-3.5" />
        {showLabel && <span className="ml-1 text-[11px]">Dark</span>}
      </button>

      <button
        type="button"
        onClick={() => setTheme('system')}
        className={`relative flex items-center justify-center rounded-lg p-1.5 text-xs transition cursor-pointer ${
          theme === 'system'
            ? 'bg-neutral-100 text-neutral-900 font-semibold shadow-2xs'
            : 'text-neutral-500 hover:text-neutral-900'
        }`}
        title="System theme"
        aria-label="System theme"
      >
        <Monitor className="h-3.5 w-3.5" />
        {showLabel && <span className="ml-1 text-[11px]">Auto</span>}
      </button>
    </div>
  );
};

