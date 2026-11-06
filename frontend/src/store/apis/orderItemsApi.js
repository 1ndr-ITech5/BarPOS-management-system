import {api} from "./api.js";

export const orderItemsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getItems: builder.query({
            query: (orderId) => ({
                url: `/api/order/${orderId}/orderItems`,
                method: "GET"
            }),
            providesTags: ["OrderItems"]
        }),
        addItem: builder.mutation({
            query: ({orderId, menuItemId}) => ({
                url: `/api/order/${orderId}/item/${menuItemId}/add`,
                method: "POST"
            }),
            invalidatesTags: ["Orders", "OrderItems"]
        }),
        removeItem: builder.mutation({
            query: ({orderId, orderItemId}) => ({
                url: `/api/order/${orderId}/item/${orderItemId}/remove`,
                method: "DELETE"
            }),
            invalidatesTags: ["Orders", "OrderItems"]
        }),
        deleteItem: builder.mutation({
            query: ({orderId, orderItemId}) => ({
                url: `/api/order/${orderId}/item/${orderItemId}/delete`,
                method: "DELETE"
            }),
            invalidatesTags: ["Orders", "OrderItems"]
        })
    })
})

export const {useGetItemsQuery, useAddItemMutation, 
    useRemoveItemMutation, useDeleteItemMutation} = orderItemsApi;