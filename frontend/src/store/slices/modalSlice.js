import {createSlice} from "@reduxjs/toolkit";

const workspaceId = localStorage.getItem("currentWorkspaceId")
const toggleState = localStorage.getItem("toggle")

const modalSlice = createSlice({
    name: "modalSlice",
    initialState: {
        receiptModal: false,
        tableModal: false,
        updatingTableId: null,
        currentWorkspace: workspaceId || null,
        toggle: toggleState || "light"
    },
    reducers: {
        setCurrentWorkspace(state, action){
            state.currentWorkspace = action.payload
            localStorage.setItem("currentWorkspaceId", action.payload)
        },
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
        changeToggle(state){
            if (state.toggle === "light"){
                state.toggle = "dark"
            }else{
                state.toggle = "light"
            }
        },
        resetToggle(state){
            state.toggle = "light"
            localStorage.removeItem("toggle")
        }
    }
})

export const {setCurrentWorkspace, setViewReceipt, setTableModal, setTableforUpdate, 
    removeTableforUpdate, changeToggle, resetToggle} = modalSlice.actions;
export default modalSlice.reducer;