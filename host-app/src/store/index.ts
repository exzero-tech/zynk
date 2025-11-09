import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth.slice';
import chargerReducer from './slices/charger.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    charger: chargerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;