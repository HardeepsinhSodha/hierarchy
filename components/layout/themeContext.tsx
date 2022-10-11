import React, { createContext, useMemo, useState } from 'react';
import useCustomEffect from '../../hooks/useCustomEffect';

export interface ThemeContextProps {
  theme: string;
  setTheme(theme: string): void;
}

export const ThemeContext = createContext<ThemeContextProps>({
  theme: 'default',
  setTheme: () => {
    null;
  },
});

export const ThemeContextProvider = ({
  value = 'default',
  children,
}: {
  value?: string;
  children: React.ReactNode;
}) => {
  const [theme, setTheme] = useState(value);

  useCustomEffect(() => {
    const storeTheme = localStorage.getItem('theme');
    applyTheme(storeTheme || 'default');
  }, []);

  /**
   * Apply theme to 'html' tag on DOM.
   */
  const applyTheme = (theme = 'default') => {
    setTheme(theme);
    const newTheme = theme;
    const html = document.getElementsByTagName('html')[0];
    localStorage.setItem('theme', theme);
    (html as HTMLHtmlElement).setAttribute('data-theme', newTheme);
  };

  const val = useMemo(
    () => ({
      theme,
      setTheme: (theme: string) => {
        applyTheme(theme);
      },
    }),
    [theme]
  );

  return <ThemeContext.Provider value={val}>{children}</ThemeContext.Provider>;
};
