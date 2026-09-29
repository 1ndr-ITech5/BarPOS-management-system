import {createSlice} from "@reduxjs/toolkit";

const tableId = localStorage.getItem("currentTableId")
const workspaceId = localStorage.getItem("currentWorkspaceId")

const modalSlice = createSlice({
    name: "modalSlice",
    initialState: {
        tableModal: false,
        selectedTable: tableId || null,
        receiptModal: false,
        currentWorkspace: workspaceId || null
    },
    reducers: {
        setTableModal(state, action){
            if(state.tableModal !== action.payload){
                state.tableModal = action.payload
            }
        },
        setSelectedTable(state, action){
            state.selectedTable = action.payload
            localStorage.setItem("currentTableId", action.payload)
        },
        setCurrentWorkspace(state, action){
            state.currentWorkspace = action.payload
            localStorage.setItem("currentWorkspaceId", action.payload)
        },
        removeSelectedTable(state){
            state.selectedTable = null
            localStorage.removeItem("currentTableId")
        },
        setViewReceipt(state, action){
            if (state.receiptModal !== action.payload){
                state.receiptModal = action.payload
            }
        }
    }
})

export const {setTableModal, setSelectedTable, setCurrentWorkspace, removeSelectedTable, setViewReceipt} = modalSlice.actions;
export default modalSlice.reducer;