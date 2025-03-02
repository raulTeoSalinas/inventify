import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type configSliceType = {
  language: 'EN' | 'ES';
  theme: 'light' | 'dark' | 'auto';
  discountRaw: boolean;
};

const initialState: configSliceType = {
  discountRaw: false,
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
    setDiscountRaw: (state, action: PayloadAction<boolean>) => {
      state.discountRaw = action.payload;
    },
  },
});

export const { setLanguage, setTheme, setDiscountRaw } = configSlice.actions;
export default configSlice.reducer;
