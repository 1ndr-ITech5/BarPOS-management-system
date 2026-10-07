import {createSlice} from "@reduxjs/toolkit";

const workspaceId = localStorage.getItem("currentWorkspaceId")
const toggleState = localStorage.getItem("toggle")

const modalSlice = createSlice({
    name: "modalSlice",
    initialState: {
        receiptModal: false,
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

export const {setCurrentWorkspace, setViewReceipt, changeToggle, resetToggle} = modalSlice.actions;
export default modalSlice.reducer;