import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  PointData:0,
  PolygonData:0,
  PrePolygonData:0,
  CrimeData:0,
  maxPolygonAmount:0,
  maxNodeAmount:0,
  AmenityData:0
}

export const byDataFilteredSlice = createSlice({
  name: 'selector',
  initialState,
  reducers: {
    setPointData: (state, action) => {
      state.PointData = action.payload
    },
    setPolygonData: (state, action) => {
      state.PolygonData = action.payload
    },
    setCrimeData: (state, action) => {
      state.CrimeData = action.payload
    },
    setPrePolygonData: (state, action) => {
      state.PrePolygonData = action.payload
    },
    setmaxPolygonAmount: (state, action) => {
      state.maxPolygonAmount = action.payload
    },
    setmaxNodeAmount: (state, action) => {
      state.maxNodeAmount = action.payload
    },
    setAmenityDataG: (state, action) => {
      state.AmenityData = action.payload
    },

  },
})

export const {setAmenityDataG,setmaxPolygonAmount,setmaxNodeAmount,setPointData,setPolygonData,setCrimeData,setPrePolygonData} = byDataFilteredSlice.actions;

//export const selectDataFiltered = (state)=>state.dataFilteredSlice.dataFiltered;

export const selectPointData = (state)=>state.dataFilteredSlice.PointData;
export const selectPolygonData = (state)=>state.dataFilteredSlice.PolygonData;
export const selectCrimeData = (state)=>state.dataFilteredSlice.CrimeData;
export const selectPrePolygonData = (state)=>state.dataFilteredSlice.PrePolygonData;
export const selectmaxPolygonAmount = (state)=>state.dataFilteredSlice.maxPolygonAmount;
export const selectmaxNodeAmount = (state)=>state.dataFilteredSlice.maxNodeAmount;
export const selectAmenityData = (state)=>state.dataFilteredSlice.AmenityData;

export default byDataFilteredSlice.reducer
