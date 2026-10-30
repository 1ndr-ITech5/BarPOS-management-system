import {createSlice} from "@reduxjs/toolkit";

const localWorkspace = JSON.parse(localStorage.getItem("workspace"))

const workspaceSlice = createSlice({
    name: "workspace",
    initialState: {
        currentWorkspace: localWorkspace || null
    },
    reducers: {
        setWorkspace: (state, action) => {
            localStorage.setItem("workspace", JSON.stringify(action.payload))
            state.currentWorkspace = action.payload
        },
        signOutWorkspace: (state) => {
            state.currentWorkspace = null
            localStorage.removeItem("workspace")
        }
    }
})

export const {setWorkspace, signOutWorkspace} = workspaceSlice.actions;
export default workspaceSlice.reducer;