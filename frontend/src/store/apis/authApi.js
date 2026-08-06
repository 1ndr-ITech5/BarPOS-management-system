import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({baseUrl: "http://localhost:5000"}),
    endpoints: (builder) => {
        return {
            login: builder.mutation({
                query: (credentials) => ({
                    url: "/api/auth/login",
                    method: "POST",
                    body: credentials,
                }),
            }),
        }
    }
})

export const {useLoginMutation} = authApi;