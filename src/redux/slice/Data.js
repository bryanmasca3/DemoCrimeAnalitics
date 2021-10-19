import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  dataFiltered:0,
  PointData:[],
  PolygonData:[],
  CrimeData:[]
}

export const byDataFilteredSlice = createSlice({
  name: 'selector',
  initialState,
  reducers: {
    setDataFilterd: (state, action) => {
      state.dataFiltered = action.payload
    },
    setPointData: (state, action) => {
      state.PointData = action.payload
    },
    setPolygonData: (state, action) => {
      state.PolygonData = action.payload
    },
    setCrimeData: (state, action) => {
      state.CrimeData = action.payload
    }

  },
})

export const {/*setDataFilterd,*/setPointData,setPolygonData,setCrimeData} = byDataFilteredSlice.actions;

//export const selectDataFiltered = (state)=>state.dataFilteredSlice.dataFiltered;

export const selectPointData = (state)=>state.dataFilteredSlice.PointData;
export const selectPolygonData = (state)=>state.dataFilteredSlice.PolygonData;
export const selectCrimeData = (state)=>state.dataFilteredSlice.CrimeData;

export default byDataFilteredSlice.reducer
