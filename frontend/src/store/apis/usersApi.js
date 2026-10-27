import {api} from "./api.js";

export const usersApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getMe: builder.query({
            query: () => ({
                url: "/api/auth/me",
                method: "GET"
            }),
        }),
        register: builder.mutation({
            query: (newUser) => ({
                url: "/api/auth/register",
                method: "POST",
                body: newUser
            }),
            invalidatesTags: ["Users"]
        })
    })
})

export const {useGetMeQuery, useRegisterMutation} = usersApi;