import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
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
    tagTypes: ["Tables", "Orders", "Payments", "Items"],
    endpoints: () => ({}),
});