import {api} from "./api.js";

export const orderItemsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        addItem: builder.mutation({
            query: ({orderId, menuItemId}) => ({
                url: `/api/order/${orderId}/item/${menuItemId}/add`,
                method: "POST"
            }),
            invalidatesTags: ["Orders"]
        }),
        removeItem: builder.mutation({
            query: ({orderId, menuItemId}) => ({
                url: `/api/order/${orderId}/item/${menuItemId}/remove`,
                method: "DELETE"
            }),
            invalidatesTags: ["Orders"]
        })
    })
})

export const {useAddItemMutation, useRemoveItemMutation} = orderItemsApi;
