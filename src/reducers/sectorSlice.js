import { createSlice } from '@reduxjs/toolkit';

import { getData } from '../store';

export const sectorSlice = createSlice({
  name: 'sectors',
  initialState: {
    sectors: []
  },
  reducers: {
    loadSectors: (state, action) => {
      state.sectors = action.payload;
    },
  },
})

// selectors
export function getSectors(state) {
	return getData(state, 'sectors.sectors');
}

// Action creators are generated for each case reducer function
export const { loadSectors } = sectorSlice.actions;

export default sectorSlice.reducer;