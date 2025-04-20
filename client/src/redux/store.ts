import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore, createTransform } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import restaurantReducer from './restaurantSlice.bak';
import customerReducer from './customerSlice';
import cartReducer from './cartSlice';
import authReducer, { normalizeUser } from './authSlice';
import type { AuthState } from './authSlice';

const rootReducer = combineReducers({
  restaurant: restaurantReducer,
  customer: customerReducer,
  auth: authReducer,
  cart: cartReducer,
});

const authTransform = createTransform<AuthState, AuthState>(
  (inboundState) => inboundState,

  (outboundState) => {
    if (outboundState?.user && outboundState?.role) {
      return {
        ...outboundState,
        user: normalizeUser(outboundState.user, outboundState.role),
      };
    }
    return outboundState;
  },
  { whitelist: ['auth', 'cart'] }
);

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'cart'],
  transforms: [authTransform],
};

const persistedReducer = persistReducer<ReturnType<typeof rootReducer>>(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
