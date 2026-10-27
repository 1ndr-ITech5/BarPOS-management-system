import {api} from "./api.js";

export const statsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getWaiterStats: builder.query({
            query: () => ({
                url: "/api/stats/waiter",
                method: "GET"
            }),
            providesTags: ["Orders", "Payments"]
        }),
        getReport: builder.query({
            query: () => ({
                url: "/api/stats/performances",
                method: "GET"
            }),
            providesTags: ["Orders", "Payments", "Users"]
        })
    })
})

export const {useGetWaiterStatsQuery, useGetReportQuery} = statsApi; 