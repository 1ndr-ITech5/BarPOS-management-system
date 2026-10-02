import {createSlice} from "@reduxjs/toolkit";

const filterSlice = createSlice({
    name: "filterSlice",
    initialState: {
        timeFilter: "Today",
        payMethodFilter: "all"
    },
    reducers: {
        setTimeFilter(state, action){
            state.timeFilter = action.payload
        },
        setPayMethodFilter(state, action){
            state.payMethodFilter = action.payload
        }
    }
})

export const {setTimeFilter, setPayMethodFilter} = filterSlice.actions;
export default filterSlice.reducer;