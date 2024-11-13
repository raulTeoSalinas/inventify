import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type configSliceType = {
  isLoggedIn: boolean;
  language: 'EN' | 'ES';
  theme: 'light' | 'dark' | 'auto';
};

const initialState: configSliceType = {
  isLoggedIn: false,
  language: 'ES',
  theme: 'auto',
};

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<'EN' | 'ES'>) => {
      state.language = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'auto'>) => {
      state.theme = action.payload;
    },
    setIsLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },
  },
});

export const { setLanguage, setTheme, setIsLoggedIn } = configSlice.actions;
export default configSlice.reducer;
