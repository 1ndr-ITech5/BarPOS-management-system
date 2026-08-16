import {createSlice} from "@reduxjs/toolkit";

const tableId = localStorage.getItem("currentTableId")

const modalSlice = createSlice({
    name: "modalSlice",
    initialState: {
        loginModal: false,
        warningModal: false,
        tableModal: false,
        selectedTable: tableId || null
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
        }
    }
})

export const {setLoginModal, setWarningModal, setTableModal, setSelectedTable} = modalSlice.actions;
export default modalSlice.reducer;