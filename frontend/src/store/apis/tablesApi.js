import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const tablesApi = createApi({
    reducerPath: "tablesApi",
    baseQuery: fetchBaseQuery({baseUrl: "http://localhost:5000"}),
    endpoints: (builder) => ({
            getTables: builder.query({
            query: () => ({
                url: "/api/tables",
                method: "GET",
            }),
        }),
    })
})

export const {useGetTablesQuery} = tablesApi;