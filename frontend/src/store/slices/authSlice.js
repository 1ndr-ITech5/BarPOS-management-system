import {createSlice} from "@reduxjs/toolkit";

const localUser = JSON.parse(localStorage.getItem("user"))

const authSlice = createSlice({
    name: "user",
    initialState: {
        user: localUser ? localUser : null,
        isAuthenticated: false
    },
    reducers: {
        loginSuccess(state, action){
            state.user = action.payload
            state.isAuthenticated = true
        },
        logout(state){
            state.user = null
            state.isAuthenticated = false
        }
    }
})

export const {loginSuccess, logout} = authSlice.actions;
export default authSlice.reducer;