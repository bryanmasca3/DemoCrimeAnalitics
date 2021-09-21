import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  selectorMarked:0,
}

export const byselectorSlice = createSlice({
  name: 'selector',
  initialState,
  reducers: {
    setSelectorMarked: (state, action) => {
      state.selectorMarked = action.payload
    }

  },
})

export const {setSelectorMarked} = byselectorSlice.actions;

export const selectSelector = (state)=>state.selectorSlice.selectorMarked;

export default byselectorSlice.reducer
