import {fetchBaseQuery, createApi} from "@reduxjs/toolkit/query/react";

export const workspaceApi = createApi({
    reducerPath: "workspaceApi",
    baseQuery: fetchBaseQuery({baseUrl: import.meta.env.VITE_API_URL}),
    endpoints: (builder) => ({
        logRealWorkspace: builder.mutation({
            query: (credentials) => ({
                url: "/api/workspace/login",
                method: "POST",
                body: credentials
            })
        }),
        logDemoWorkspace: builder.mutation({
            query: () => ({
                url: "/api/workspace/demo",
                method: "POST",
            })
        })
    })
})

export const {useLogRealWorkspaceMutation, useLogDemoWorkspaceMutation} = workspaceApi;