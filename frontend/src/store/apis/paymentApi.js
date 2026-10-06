import {api} from "./api.js";

export const paymentApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createPayment: builder.mutation({
            query: ({orderId, paymentData}) => ({
                url: `/api/order/${orderId}/payment`,
                method: "POST",
                body: paymentData
            }),
            invalidatesTags: ["Tables", "Payments"]
        }),
        getPayment: builder.query({
            query: (orderId) => ({
                url: `/api/${orderId}/payment`,
                method: "GET"
            })
        }),
        getAllPayments: builder.query({
            query: () => ({
                url: "/api/payments",
                method: "GET"
            }), 
            providesTags: ["Payments"]
        })
    })
})

export const {useCreatePaymentMutation, useGetPaymentQuery, useGetAllPaymentsQuery} = paymentApi;