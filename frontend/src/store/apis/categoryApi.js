import {api} from "./api.js";

export const categoryApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getCategories: builder.query({
            query: () => ({
                url: "/api/categories",
                method: "GET"
            }),
            providesTags: ["Category"]
        }),
        createCategory: builder.mutation({
            query: (categoryData) => ({
                url: "/api/categories/create",
                method: "POST",
                body: categoryData
            }),
            invalidatesTags: ["Category"]
        }),
        toggleActivity: builder.mutation({
            query: (categoryId) => ({
                url: `/api/categories/activity/${categoryId}`,
                method: "PATCH"
            }),
            invalidatesTags: ["Category"]
        }),
        editCategory: builder.mutation({
            query: ({categoryId, categoryData}) => ({
                url: `/api/categories/edit/${categoryId}`,
                method: "PATCH",
                body: categoryData
            }),
            invalidatesTags: ["Category"]
        }),
        deleteCategory: builder.mutation({
            query: (categoryId) => ({
                url: `/api/categories/delete/${categoryId}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Category"]
        }),
        restoreCategory: builder.mutation({
            query: (categoryId) => ({
                url: `/api/categories/restore/${categoryId}`,
                method: "PATCH"
            }),
            invalidatesTags: ["Category"]
        })
    })
})

export const {useGetCategoriesQuery, useCreateCategoryMutation, useToggleActivityMutation,
    useEditCategoryMutation, useDeleteCategoryMutation, useRestoreCategoryMutation} = categoryApi;