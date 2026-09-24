import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const itemsApi = createApi({
    reducerPath: "itemsApi",
    baseQuery: fetchBaseQuery({baseUrl: import.meta.env.VITE_API_URL}),
    endpoints: (builder) => ({
        getItems: builder.query({
            query: () => ({
                url: "/api/menu-items",
                method: "GET"
            })
        })
    })
})

export const {useGetItemsQuery} = itemsApi;