import {createSlice} from "@reduxjs/toolkit";

const currentOrderId = localStorage.getItem("orderId")

const orderSlice = createSlice({
    name: "order",
    initialState: {
        currentOrderId: currentOrderId || null,
        preBillOrderId: null
    },
    reducers: {
        setCurrentOrder: (state, action) => {
            state.currentOrderId = action.payload
            localStorage.setItem("orderId", action.payload)
        },
        clearCurrentOrder: (state) => {
            state.currentOrderId = null
            localStorage.removeItem("orderId")
            localStorage.removeItem("currentTableId")
        },
        setPreBill(state, action){
            state.preBillOrderId = action.payload
        }
    }
})

export const {setCurrentOrder, clearCurrentOrder, setPreBill} = orderSlice.actions;
export default orderSlice.reducer;