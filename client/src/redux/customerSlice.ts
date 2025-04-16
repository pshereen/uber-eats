import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Customer {
  name: string;
  email: string;
  location?: string;
}

interface CustomerState {
  currentCustomer: Customer | null;
}

const initialState: CustomerState = {
  currentCustomer: null,
};

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    setCustomer(state, action: PayloadAction<Customer>) {
      state.currentCustomer = action.payload;
    },
    clearCustomer(state) {
      state.currentCustomer = null;
    },
  },
});

export const { setCustomer, clearCustomer } = customerSlice.actions;
export default customerSlice.reducer;
