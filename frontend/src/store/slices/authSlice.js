import {createSlice} from "@reduxjs/toolkit";

const localUser = JSON.parse(localStorage.getItem("user"))

const authSlice = createSlice({
    name: "user",
    initialState: {
        user: localUser ? localUser : null,
        error: null,
        loading: false,
        isAuthenticated: false
    },
    reducers: {
        loginStarted(state){
            state.loading = true
        },
        loginFailed(state, action){
            state.loading = false
            state.error = action.payload
        },
        loginSuccess(state, action){
            state.user = action.payload
            state.isAuthenticated = true
            state.loading = false
        },
        logout(state){
            state.user = null
            state.isAuthenticated = false
        }
    }
})

export const {loginStarted, loginFailed, loginSuccess, logout} = authSlice.actions;
export default authSlice.reducer;