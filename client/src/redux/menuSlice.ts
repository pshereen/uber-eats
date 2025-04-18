import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export interface MenuItem {
  _id: string;
  title: string;
  description: string;
  price: number;
  image?: string;
  restaurant: string;
}

interface MenuState {
  items: MenuItem[];
  loading: boolean;
  error: string | null;
}

const initialState: MenuState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchMenuItems = createAsyncThunk<
  MenuItem[],          
  string,              
  { rejectValue: string } 
>(
  'menu/fetchMenuItems',
  async (restaurantId, thunkAPI) => {
    try {
      const res = await axios.get(`${API_URL}/api/menu?restaurant=${restaurantId}`);
      return res.data;
    } catch (error: unknown) {
        const err = error as { response?: { data?: { error?: string } } };
        return thunkAPI.rejectWithValue(err.response?.data?.error || 'Failed to fetch');
      }
  }
);

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenuItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenuItems.fulfilled, (state, action: PayloadAction<MenuItem[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMenuItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unknown error';
      });
  },
});

export default menuSlice.reducer;
