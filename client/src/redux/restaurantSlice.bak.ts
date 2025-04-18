import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Restaurant {
  name: string;
  email: string;
  location?: string;
  image?: string;
}

interface RestaurantState {
  currentRestaurant: Restaurant | null;
}

const initialState: RestaurantState = {
  currentRestaurant: null,
};

const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState,
  reducers: {
    setRestaurant(state, action: PayloadAction<Restaurant>) {
      state.currentRestaurant = action.payload;
      console.log(state.currentRestaurant);
    },
    clearRestaurant(state) {
      state.currentRestaurant = null;
    },
  },
});

export const { setRestaurant, clearRestaurant } = restaurantSlice.actions;
export default restaurantSlice.reducer;
