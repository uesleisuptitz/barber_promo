import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
} from 'react';
import {COLORS} from '../assets';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext({
  primary: '',
  background: '',
  text: '',
  isDarkMode: false,
  switchTheme: () => {},
});

export const ThemeProvider = ({children}) => {
  const [primary, setPrimary] = useState(COLORS.primary);
  const [background, setBackground] = useState(COLORS.white);
  const [text, setText] = useState(COLORS.gray);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const switchTheme = useCallback(() => {
    setIsDarkMode(!isDarkMode);
    saveLocalDarkMode(!isDarkMode ? 'dark' : 'light');
  }, [isDarkMode, saveLocalDarkMode]);

  useEffect(() => {
    if (isDarkMode) {
      setText(COLORS.white);
      setBackground(COLORS.gray);
    } else {
      setText(COLORS.gray);
      setBackground(COLORS.white);
    }
  }, [isDarkMode]);

  const saveLocalDarkMode = useCallback(
    async value => await AsyncStorage.setItem('isDarkMode', value),
    [],
  );

  const getLocalDarkMode = useCallback(async () => {
    let localData = await AsyncStorage.getItem('isDarkMode');
    setIsDarkMode(localData === 'dark');
  }, []);

  useEffect(() => getLocalDarkMode(), [getLocalDarkMode]);

  return (
    <ThemeContext.Provider
      value={{primary, background, text, switchTheme, isDarkMode}}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
