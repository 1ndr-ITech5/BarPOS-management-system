import {configureStore} from "@reduxjs/toolkit";
import {authApi} from "./apis/authApi.js";
import {tablesApi} from "./apis/tablesApi.js";
import userReducer from "./slices/authSlice.js";

export const store = configureStore({
    reducer: {
        user: userReducer,
        [authApi.reducerPath]: authApi.reducer,
        [tablesApi.reducerPath]: tablesApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware).concat(tablesApi.middleware)
});