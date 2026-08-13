import {api} from "./api.js";

export const orderApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: ({tableId}) => ({
                method: "POST",
                url: `/api/order/${tableId}/open`,
                body: tableId
            }),
            invalidatesTags: ["Tables"],
        }),
        deleteOrder: builder.mutation({
            query: ({tableId}) => ({
                method: "DELETE",
                url: `/api/order/${tableId}/delete`,
                body: tableId
            }),
            invalidatesTags: ["Tables"],
        }),
    })
});

export const {useCreateOrderMutation, useDeleteOrderMutation} = orderApi; 