import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RestaurantUser, CustomerUser } from '../types/UserTypes';

type AuthUser = RestaurantUser | CustomerUser;

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  role: 'restaurant' | 'customer' | null;
}

const initialState: AuthState = {
  token: localStorage.getItem('token') ?? null,
  user: (() => {
    const stored = localStorage.getItem('user');
    try {
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })(),
  role: (localStorage.getItem('role') as 'restaurant' | 'customer') ?? null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: AuthUser; token: string; role: 'restaurant' | 'customer' }>
    ) => {
      const { user, token, role } = action.payload;
      state.user = user;
      state.token = token;
      state.role = role;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('role', role);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;

      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
