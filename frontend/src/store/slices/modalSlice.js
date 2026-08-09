import {createSlice} from "@reduxjs/toolkit";

const modalSlice = createSlice({
    name: "modalSlice",
    initialState: {
        loginModal: false,
        warningModal: false,
        tableModal: false,
        selectedTable: null
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
        }
    }
})

export const {setLoginModal, setWarningModal, setTableModal, setSelectedTable} = modalSlice.actions;
export default modalSlice.reducer;