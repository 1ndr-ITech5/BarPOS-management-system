import {configureStore} from "@reduxjs/toolkit";
import {authApi} from "./apis/authApi.js";
import userReducer from "./slices/authSlice.js";

export const store = configureStore({
    reducer: {
        user: userReducer,
        [authApi.reducerPath]: authApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});