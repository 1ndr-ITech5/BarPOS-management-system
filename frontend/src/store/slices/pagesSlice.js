import {createSlice} from "@reduxjs/toolkit";

const menuTab = localStorage.getItem("menu-tab")
const toggleState = localStorage.getItem("toggle")

const pagesSlice = createSlice({
    name: "pages",
    initialState: {
        menu_subpage: menuTab || "products",
        toggle: toggleState || "light"
    },
    reducers: {
        setSubpage: (state, action) => {
            state.menu_subpage = action.payload
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

export const {setSubpage, changeToggle, resetToggle} = pagesSlice.actions
export default pagesSlice.reducer