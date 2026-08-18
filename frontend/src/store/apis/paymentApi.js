import {api} from "./api.js";

export const paymentApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createPayment: builder.mutation({
            query: ({orderId, paymentData}) => ({
                url: `/api/order/${orderId}/payment`,
                method: "POST",
                body: paymentData
            }),
            invalidatesTags: ["Tables", "Orders"]
        }),
        getPayment: builder.query({
            query: (orderId) => ({
                url: `/api/${orderId}/payment`,
                method: "GET"
            })
        })
    })
})

export const {useCreatePaymentMutation, useGetPaymentQuery} = paymentApi;