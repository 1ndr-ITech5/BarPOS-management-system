import {createSlice} from "@reduxjs/toolkit";

const currentOrderId = localStorage.getItem("orderId")

const orderSlice = createSlice({
    name: "order",
    initialState: {
        currentOrderId: currentOrderId || null,
        viewOrder: false
    },
    reducers: {
        setCurrentOrder: (state, action) => {
            state.currentOrderId = action.payload
            localStorage.setItem("orderId", action.payload)
        },
        setViewOrder: (state, action) => {
            state.viewOrder = action.payload
        },
        clearCurrentOrder: (state) => {
            state.currentOrderId = null
            localStorage.removeItem("orderId")
            localStorage.removeItem("currentTableId")
        }
    }
})

export const {setCurrentOrder, setViewOrder, clearCurrentOrder} = orderSlice.actions;
export default orderSlice.reducer;