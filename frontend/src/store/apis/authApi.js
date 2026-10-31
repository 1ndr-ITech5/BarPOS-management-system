import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
        prepareHeaders: (headers) => {
            const workspace = JSON.parse(localStorage.getItem("workspace"))

            if (workspace?.token){
                headers.set("Authorization" ,`Bearer ${workspace.token}`)
            }
            return headers
        }}    
    ),
    endpoints: (builder) => {
        return {
            login: builder.mutation({
                query: (credentials) => ({
                    url: "/api/auth/login",
                    method: "POST",
                    body: credentials,
                }),
            }),
            loginDemo: builder.mutation({
                query: () => ({
                    url: "/api/auth/login-demo",
                    method: "POST"
                }),
            })
        }
    }
})

export const {useLoginMutation, useLoginDemoMutation} = authApi;