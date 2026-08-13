import {api} from "./api.js";

export const tablesApi = api.injectEndpoints({
    endpoints: (builder) => ({
            getTables: builder.query({
            query: () => ({
                url: "/api/tables",
                method: "GET",
            }),
            providesTags: ["Tables"],
        }),
    })
})

export const {useGetTablesQuery} = tablesApi;