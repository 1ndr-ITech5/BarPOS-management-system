import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {clearCurrentOrder} from "../slices/orderSlice.js";
import {resetToggle} from "../slices/modalSlice.js";
import {logout} from "../slices/authSlice.js";
import {toast} from "react-toastify";

const rawBaseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers) => {
        const user = JSON.parse(localStorage.getItem("user"))

        if(user?.token){
            headers.set("Authorization", `Bearer ${user.token}`)
        }
        return headers;
    }
})

// handling the cases when jwt token is expired
const baseQueryWithReAuth = async (args, api, extraOptions) => {
    const result = await rawBaseQuery(args, api, extraOptions)

    if (result.error?.status === 401) {
        // centralizuar: token i skaduar/invalid -> pastro gjithcka dhe kthehu te login
        localStorage.removeItem("user")
        api.dispatch(clearCurrentOrder())
        api.dispatch(resetToggle())
        api.dispatch(logout())

        toast.error("Your session has expired. Please log in again!", {
            toastId: "session-expired"
        })
    }

    return result
}

export const api = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithReAuth,
    tagTypes: ["Tables", "Orders", "Payments", "Products", "Category"],
    endpoints: () => ({}),
});