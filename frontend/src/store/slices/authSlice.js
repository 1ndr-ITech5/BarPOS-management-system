import {createSlice} from "@reduxjs/toolkit";

const localUser = JSON.parse(localStorage.getItem("user"))

const authSlice = createSlice({
    name: "user",
    initialState: {
        user: localUser ? localUser : null,
        isAuthenticated: !!localUser
    },
    reducers: {
        loginSuccess(state, action){
            localStorage.setItem("user", JSON.stringify(action.payload))
            state.user = action.payload
        },
        logout(state){
            localStorage.removeItem("currentWorkspaceId")
            localStorage.removeItem("user")
            state.user = null
        }
    }
})

export const {loginSuccess, logout} = authSlice.actions;
export default authSlice.reducer;