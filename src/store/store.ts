// External Dependencies
import { configureStore } from '@reduxjs/toolkit';
// Internal Dependencies
import configReducer from './slices/configSlice';

export const store = configureStore({
    reducer: {
        config: configReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
