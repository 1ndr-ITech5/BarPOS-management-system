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
        createTable: builder.mutation({
            query: (tableData) => ({
                url: "/api/tables/create",
                method: POST,
                body: tableData
            }),
            invalidatesTags: ["Tables"]
        })
    })
})

export const {useGetTablesQuery, useCreateTableMutation} = tablesApi;