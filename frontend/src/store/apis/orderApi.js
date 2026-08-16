import {api} from "./api.js";

export const orderApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: ({tableId}) => ({
                method: "POST",
                url: `/api/order/${tableId}/open`
            }),
            invalidatesTags: ["Tables", "Orders"],
        }),
        deleteOrder: builder.mutation({
            query: (tableId) => ({
                method: "DELETE",
                url: `/api/order/${tableId}/delete`
            }),
            invalidatesTags: ["Tables"],
        }),
        getOrder: builder.query({
            query: (tableId) => ({
                url: `/api/order/${tableId}`,
                method: "GET"
            }),
            providesTags: ["Orders"]
        })
    })
});

export const {useCreateOrderMutation, useDeleteOrderMutation, useGetOrderQuery} = orderApi; 