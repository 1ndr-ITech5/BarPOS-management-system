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
        getOrderByTable: builder.query({
            query: (tableId) => ({
                url: `/api/order/tables/${tableId}`,
                method: "GET"
            }),
            providesTags: ["Orders"]
        }),
        getOrderById: builder.query({
            query: (orderId) => ({
                url: `/api/order/orders/${orderId}`,
                method: "GET"
            }),
            providesTags: ["Orders"]
        }),
        getMyOrders: builder.query({
            query: () => ({
                url: "/api/order/my-orders",
                method: "GET"
            }),
            providesTags: ["Orders"]
        }),
        getAllOrders: builder.query({
            query: () => ({
                url: "/api/order/all-orders",
                method: "GET"
            }),
            providesTags: ["Orders"]
        })
    })
});

export const {useCreateOrderMutation, useDeleteOrderMutation, 
    useGetOrderByIdQuery, useGetMyOrdersQuery, useGetAllOrdersQuery, useLazyGetOrderByTableQuery} = orderApi; 