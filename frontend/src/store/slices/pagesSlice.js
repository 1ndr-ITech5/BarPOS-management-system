import {createSlice} from "@reduxjs/toolkit";

const menuTab = localStorage.getItem("menu-tab")

const pagesSlice = createSlice({
    name: "pages",
    initialState: {
        menu_subpage: menuTab || "products"
    },
    reducers: {
        setSubpage: (state, action) => {
            state.menu_subpage = action.payload
        }
    }
})

export const {setSubpage} = pagesSlice.actions
export default pagesSlice.reducer