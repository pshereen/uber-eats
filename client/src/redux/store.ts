import { configureStore } from '@reduxjs/toolkit';
import restaurantReducer from './restaurantSlice.bak';
import customerReducer from './customerSlice';
import authReducer from './authSlice';


export const store = configureStore({
  reducer: {
    restaurant: restaurantReducer,
    customer: customerReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
