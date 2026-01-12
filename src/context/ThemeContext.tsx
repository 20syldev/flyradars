import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'system' | 'dark' | 'light';

interface ThemeContextType {
	theme: Theme;
	setTheme: (theme: Theme) => void;
	resolvedTheme: 'dark' | 'light';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
	const [theme, setTheme] = useState<Theme>(() => {
		const stored = localStorage.getItem('flyradars-theme');
		return (stored as Theme) || 'system';
	});

	const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('light');

	useEffect(() => {
		const updateResolvedTheme = () => {
			if (theme === 'system') {
				const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
				setResolvedTheme(isDark ? 'dark' : 'light');
			} else {
				setResolvedTheme(theme);
			}
		};

		updateResolvedTheme();

		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		const handler = () => {
			if (theme === 'system') {
				updateResolvedTheme();
			}
		};

		mediaQuery.addEventListener('change', handler);
		return () => mediaQuery.removeEventListener('change', handler);
	}, [theme]);

	useEffect(() => {
		const root = document.documentElement;
		if (resolvedTheme === 'dark') {
			root.classList.add('dark');
		} else {
			root.classList.remove('dark');
		}
	}, [resolvedTheme]);

	useEffect(() => {
		localStorage.setItem('flyradars-theme', theme);
	}, [theme]);

	return (
		<ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
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
