import { configureStore } from '@reduxjs/toolkit'
import selectorSlice from "./slice/Data"

export const store = configureStore({
  reducer: {
    selectorSlice:selectorSlice,
  }
})
