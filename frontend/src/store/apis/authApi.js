import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({baseUrl: import.meta.env.VITE_API_URL,
        prepareHeaders: (headers) => {
        const user = JSON.parse(localStorage.getItem("user"));

        if (user?.token) {
            headers.set("Authorization", `Bearer ${user.token}`);
        }

        return headers;
        },
    }),
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
            }),
            register: builder.mutation({
                query: (newUser) => ({
                    url: "/api/auth/register",
                    method: "POST",
                    body: newUser
                }),
            }),
        }
    }
})

export const {useLoginMutation, useRegisterMutation, useLoginDemoMutation} = authApi;