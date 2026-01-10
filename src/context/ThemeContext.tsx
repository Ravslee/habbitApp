import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
    theme: ThemeMode;
    isDark: boolean;
    setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
    initialTheme?: ThemeMode;
    onThemeChange?: (theme: ThemeMode) => void;
}

export function ThemeProvider({ children, initialTheme = 'dark', onThemeChange }: ThemeProviderProps) {
    const [theme, setThemeState] = useState<ThemeMode>(initialTheme);
    const systemColorScheme = useColorScheme();

    // Update theme when initialTheme prop changes (e.g., loaded from storage)
    useEffect(() => {
        setThemeState(initialTheme);
    }, [initialTheme]);

    const setTheme = (newTheme: ThemeMode) => {
        setThemeState(newTheme);
        onThemeChange?.(newTheme);
    };

    // Determine if dark mode should be active
    const isDark = theme === 'system'
        ? (systemColorScheme ?? 'dark') === 'dark'
        : theme === 'dark';

    return (
        <ThemeContext.Provider value={{ theme, isDark, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme(): ThemeContextType {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
