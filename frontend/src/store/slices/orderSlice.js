import {createSlice} from "@reduxjs/toolkit";

const orderSlice = createSlice({
    name: "order",
    initialState: {
        currentOrderId: null
    },
    reducers: {
        setCurrentOrder: (state, action) => {
            state.currentOrderId = action.payload
        },
        clearCurrentOrder: (state) => {
            state.currentOrderId = null
        }
    }
})

export const {setCurrentOrder, clearCurrentOrder} = orderSlice.actions;
export default orderSlice.reducer;