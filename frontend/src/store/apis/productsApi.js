import {api} from "./api.js";

export const productsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: () => ({
                url: "/api/products",
                method: "GET"
            }),
            providesTags: ["Products", "Category"]
        }),
        createProduct: builder.mutation({
            query: (productData) => ({
                url: "/api/products/create",
                method: "POST",
                body: productData
            }),
            invalidatesTags: ["Products"]
        }),
        editProduct: builder.mutation({
            query: ({productData, productId}) => ({
                url: `/api/products/edit/${productId}`,
                method: "PATCH",
                body: productData
            }),
            invalidatesTags: ["Products"]
        }),
        toggleProduct: builder.mutation({
            query: (productId) => ({
                url: `/api/products/toggle-activity/${productId}`,
                method: "PATCH"
            }),
            invalidatesTags: ["Products"]
        }),
        deleteProduct: builder.mutation({
            query: (productId) => ({
                url: `/api/products/delete/${productId}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Products"]
        }),
        restoreProduct: builder.mutation({
            query: (productId) => ({
                url: `/api/products/restore/${productId}`,
                method: "PATCH"
            }),
            invalidatesTags: ["Products"]
        })
    })
})

export const {useGetProductsQuery, useCreateProductMutation, useEditProductMutation,
    useToggleProductMutation, useDeleteProductMutation, useRestoreProductMutation} = productsApi;