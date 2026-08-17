import {createSlice} from "@reduxjs/toolkit";

const currentOrderId = localStorage.getItem("orderId")

const orderSlice = createSlice({
    name: "order",
    initialState: {
        currentOrderId: currentOrderId || null
    },
    reducers: {
        setCurrentOrder: (state, action) => {
            state.currentOrderId = action.payload
            localStorage.setItem("orderId", action.payload)
        },
        clearCurrentOrder: () => {
            localStorage.removeItem("orderId")
            localStorage.removeItem("currentTableId")
        }
    }
})

export const {setCurrentOrder, clearCurrentOrder} = orderSlice.actions;
export default orderSlice.reducer;