// External Dependencies
import { configureStore } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer, persistStore } from 'redux-persist';
// Internal Dependencies
import configReducer from './slices/configSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['config'],
};

const configPersisted = persistReducer(persistConfig, configReducer);

export const store = configureStore({
  reducer: {
    config: configPersisted,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
