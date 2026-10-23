import {api} from "./api.js";

export const productsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: () => ({
                url: "/api/products",
                method: "GET"
            }),
            providesTags: ["Products"]
        })
    })
})

export const {useGetProductsQuery} = productsApi;