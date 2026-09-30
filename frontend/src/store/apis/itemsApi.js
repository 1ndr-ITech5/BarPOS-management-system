import {api} from "./api.js";

export const itemsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getItems: builder.query({
            query: () => ({
                url: "/api/menu-items",
                method: "GET"
            }),
            providesTags: ["Items"]  // shto tag nese do invalidosh me vone
        })
    })
})

export const {useGetItemsQuery} = itemsApi;