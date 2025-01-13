import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  district: [],
};

export const districtSlice = createSlice({
  name: "district",
  initialState,
  reducers: {
    setDistrict: (state, { payload }) => {
      state.district = payload;
    },
  },
});

export const { 
  setDistrict 
} = districtSlice.actions;
