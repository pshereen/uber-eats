import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RestaurantUser, CustomerUser } from '../types/UserTypes';

export type AuthUser = RestaurantUser | CustomerUser;

export interface AuthState {
  token: string | null;
  user: AuthUser | null;
  role: 'restaurant' | 'customer' | null;
}

export function normalizeUser(
  user: Partial<RestaurantUser & { id?: string }> | Partial<CustomerUser & { id?: string }>,
  role: 'restaurant' | 'customer'
): AuthUser {
  const _id = user._id ?? user.id ?? '';

  if (role === 'restaurant') {
    const { image = '', ...rest } = user as RestaurantUser;
    return {
      ...rest,
      _id,
      image,
      role: 'restaurant',
    };
  } else {
    return {
      ...(user as CustomerUser),
      _id,
      role: 'customer',
    };
  }
}

const initialState: AuthState = {
  token: null,
  user: null,
  role: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: AuthUser;
        token: string;
        role: 'restaurant' | 'customer';
      }>
    ) => {
      const { user, token, role } = action.payload;
      const normalizedUser = normalizeUser(user, role);

      state.user = normalizedUser;
      state.token = token;
      state.role = role;
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
