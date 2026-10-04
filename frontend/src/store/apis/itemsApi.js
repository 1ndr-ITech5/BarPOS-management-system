import {api} from "./api.js";

export const itemsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getItems: builder.query({
            query: () => ({
                url: "/api/menu-items",
                method: "GET"
            }),
            providesTags: ["Items"]
        })
    })
})

export const {useGetItemsQuery} = itemsApi;