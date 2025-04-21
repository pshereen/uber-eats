import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GuestInfo {
  name: string;
  email: string;
  address: string;
}

interface GuestState {
  info: GuestInfo | null;
}

const initialState: GuestState = {
  info: null,
};

const guestSlice = createSlice({
  name: 'guest',
  initialState,
  reducers: {
    setGuestInfo: (state, action: PayloadAction<GuestInfo>) => {
      state.info = action.payload;
    },
    clearGuestInfo: (state) => {
      state.info = null;
    },
  },
});

export const { setGuestInfo, clearGuestInfo } = guestSlice.actions;
export default guestSlice.reducer;
