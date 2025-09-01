import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  preferences: {
    autoSave: boolean;
    notifications: boolean;
    language: string;
  };
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  preferences: {
    autoSave: true,
    notifications: true,
    language: 'en',
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    updatePreferences: (state, action: PayloadAction<Partial<UserState['preferences']>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const {
  setUser,
  setLoading,
  updatePreferences,
  logout,
} = userSlice.actions;

export default userSlice.reducer;
