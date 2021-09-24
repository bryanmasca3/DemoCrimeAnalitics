import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  dataFiltered:0,
}

export const byDataFilteredSlice = createSlice({
  name: 'selector',
  initialState,
  reducers: {
    setDataFilterd: (state, action) => {
      state.dataFiltered = action.payload
    }

  },
})

export const {setDataFilterd} = byDataFilteredSlice.actions;

export const selectDataFiltered = (state)=>state.dataFilteredSlice.dataFiltered;

export default byDataFilteredSlice.reducer
