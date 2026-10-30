import {configureStore} from "@reduxjs/toolkit";
import {authApi} from "./apis/authApi.js";
import {workspaceApi} from "./apis/workspaceApi.js";
import {api} from "./apis/api.js";
import workspaceReducer from "./slices/workspaceSlice.js";
import userReducer from "./slices/authSlice.js";
import modalReducer from "./slices/modalSlice.js";
import orderReducer from "./slices/orderSlice.js";
import filterReducer from "./slices/filterSlice.js";
import pagesReducer from "./slices/pagesSlice.js";

export const store = configureStore({
    reducer: {
        workspace: workspaceReducer,
        user: userReducer,
        modals: modalReducer,
        order: orderReducer,
        filters: filterReducer,
        pages: pagesReducer,
        [workspaceApi.reducerPath]: workspaceApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(workspaceApi.middleware).concat(authApi.middleware).concat(api.middleware)
});