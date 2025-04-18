import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore, createTransform } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import restaurantReducer from './restaurantSlice.bak';
import customerReducer from './customerSlice';
import authReducer, { normalizeUser } from './authSlice';
import type { AuthState } from './authSlice';

// Combine reducers
const rootReducer = combineReducers({
  restaurant: restaurantReducer,
  customer: customerReducer,
  auth: authReducer,
});

// 🔁 Transform to normalize `user` on rehydration
const authTransform = createTransform<AuthState, AuthState>(
  // transform state before persisting
  (inboundState) => inboundState,

  // transform state after rehydration
  (outboundState) => {
    if (outboundState?.user && outboundState?.role) {
      return {
        ...outboundState,
        user: normalizeUser(outboundState.user, outboundState.role),
      };
    }
    return outboundState;
  },
  { whitelist: ['auth'] }
);

// Persist config
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
  transforms: [authTransform],
};

// Typed persisted reducer
const persistedReducer = persistReducer<ReturnType<typeof rootReducer>>(persistConfig, rootReducer);

// Store setup
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // suppress warnings about non-serializable values like transform
    }),
});

// Persistor
export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
