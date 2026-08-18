import {createSlice} from "@reduxjs/toolkit";

const tableId = localStorage.getItem("currentTableId")

const modalSlice = createSlice({
    name: "modalSlice",
    initialState: {
        loginModal: false,
        warningModal: false,
        tableModal: false,
        selectedTable: tableId || null,
        receiptModal: false
    },
    reducers: {
        setLoginModal(state, action){
            if(state.loginModal !== action.payload){
                state.loginModal = action.payload
            }
        },
        setWarningModal(state, action){
            if(state.warningModal !== action.payload){
                state.warningModal = action.payload
            }
        },
        setTableModal(state, action){
            if(state.tableModal !== action.payload){
                state.tableModal = action.payload
            }
        },
        setSelectedTable(state, action){
            state.selectedTable = action.payload
            localStorage.setItem("currentTableId", action.payload)
        },
        setViewReceipt(state, action){
            if (state.receiptModal !== action.payload){
                state.receiptModal = action.payload
            }
        }
    }
})

export const {setLoginModal, setWarningModal, setTableModal, setSelectedTable, setViewReceipt} = modalSlice.actions;
export default modalSlice.reducer;