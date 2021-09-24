import { configureStore } from '@reduxjs/toolkit'
import dataFilteredSlice from "./slice/Data"

export const store = configureStore({
  reducer: {
    dataFilteredSlice:dataFilteredSlice,
  }
})
