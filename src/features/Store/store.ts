import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../authSlice";
import branchReducer from "../branchSlice";
import { api } from "../../services/api";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        branch: branchReducer,
        [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;