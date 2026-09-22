import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
    baseUrl: "http://localhost:5000",
    prepareHeaders: (headers) => {
        const user = JSON.parse(localStorage.getItem("user"))

        if(user?.token){
            headers.set("Authorization", `Bearer ${user.token}`)
        }
        return headers;
    }
})

export const api = createApi({
    reducerPath: "api",
    baseQuery,
    tagTypes: ["Tables", "Orders", "Payments"],
    endpoints: () => ({}),
});