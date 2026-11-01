import {createSlice} from "@reduxjs/toolkit";

const modalSlice = createSlice({
    name: "modalSlice",
    initialState: {
        receiptModal: false,
        tableModal: false,
        updatingTableId: null,
        discardModal: false
    },
    reducers: {
        setViewReceipt(state, action){
            if (state.receiptModal !== action.payload){
                state.receiptModal = action.payload
            }
        },
        setTableModal(state){
            if (state.tableModal === false){
                state.tableModal = true
            }else{
                state.tableModal = false
            }
        },
        setTableforUpdate(state, action){
            state.updatingTableId = action.payload
        },
        removeTableforUpdate(state){
            state.updatingTableId = null
        },
        setDiscardModal(state, action){
            state.discardModal = action.payload
        }
    }
})

export const {setViewReceipt, setTableModal, setTableforUpdate, 
    removeTableforUpdate, setDiscardModal} = modalSlice.actions;
export default modalSlice.reducer;