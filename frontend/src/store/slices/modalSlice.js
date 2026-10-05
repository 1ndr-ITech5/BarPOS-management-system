import {createSlice} from "@reduxjs/toolkit";

const tableId = localStorage.getItem("currentTableId")
const workspaceId = localStorage.getItem("currentWorkspaceId")
const toggleState = localStorage.getItem("toggle")

const modalSlice = createSlice({
    name: "modalSlice",
    initialState: {
        tableModal: false,
        selectedTable: tableId || null,
        receiptModal: false,
        currentWorkspace: workspaceId || null,
        toggle: toggleState || "light"
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
        },
        changeToggle(state){
            if (state.toggle === "light"){
                state.toggle = "dark"
            }else{
                state.toggle = "light"
            }
        }
    }
})

export const {setTableModal, setSelectedTable, setCurrentWorkspace, removeSelectedTable, setViewReceipt, changeToggle} = modalSlice.actions;
export default modalSlice.reducer;