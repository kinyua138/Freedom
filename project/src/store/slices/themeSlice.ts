import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeState {
  mode: ThemeMode;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  customColors: Record<string, string>;
}

const initialState: ThemeState = {
  mode: 'light',
  primaryColor: '#3B82F6',
  secondaryColor: '#6B7280',
  accentColor: '#8B5CF6',
  customColors: {},
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
    },
    setPrimaryColor: (state, action: PayloadAction<string>) => {
      state.primaryColor = action.payload;
    },
    setSecondaryColor: (state, action: PayloadAction<string>) => {
      state.secondaryColor = action.payload;
    },
    setAccentColor: (state, action: PayloadAction<string>) => {
      state.accentColor = action.payload;
    },
    setCustomColor: (state, action: PayloadAction<{ key: string; value: string }>) => {
      const { key, value } = action.payload;
      state.customColors[key] = value;
    },
    resetTheme: () => {
      return { ...initialState };
    },
  },
});

export const {
  setThemeMode,
  setPrimaryColor,
  setSecondaryColor,
  setAccentColor,
  setCustomColor,
  resetTheme,
} = themeSlice.actions;

export default themeSlice.reducer;
