import {configureStore} from "@reduxjs/toolkit";
import {authApi} from "./apis/authApi.js";
import {api} from "./apis/api.js";
import userReducer from "./slices/authSlice.js";
import modalReducer from "./slices/modalSlice.js";

export const store = configureStore({
    reducer: {
        user: userReducer,
        modals: modalReducer,
        [authApi.reducerPath]: authApi.reducer,
        [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware).concat(api.middleware)
});