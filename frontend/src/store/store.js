import {configureStore} from "@reduxjs/toolkit";
import {authApi} from "./apis/authApi.js";
import {api} from "./apis/api.js";
import {itemsApi} from "./apis/itemsApi.js";
import userReducer from "./slices/authSlice.js";
import modalReducer from "./slices/modalSlice.js";
import orderReducer from "./slices/orderSlice.js";
import filterReducer from "./slices/filterSlice.js";

export const store = configureStore({
    reducer: {
        user: userReducer,
        modals: modalReducer,
        order: orderReducer,
        filters: filterReducer,
        [authApi.reducerPath]: authApi.reducer,
        [api.reducerPath]: api.reducer,
        [itemsApi.reducerPath]: itemsApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware).concat(api.middleware)
    .concat(itemsApi.middleware)
});