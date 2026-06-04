import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../features/Store/store";
import type {
    StockItem,
    Product,
    Bill,
    StockUpdate,
} from "../types/index";

export const api = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL || "http://localhost:5120/api/v1",
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.token;
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ["Stock", "Product", "Bill", "StockUpdate", "Dashboard"],
    endpoints: (builder) => ({
        // Auth
        login: builder.mutation({
            query: (data) => ({
                url: "/auth/login",
                method: "POST",
                body: data,
            }),
        }),
        register: builder.mutation({
            query: (data) => ({
                url: "/auth/register",
                method: "POST",
                body: data,
            }),
        }),

        // Dashboard
        getDashboardStats: builder.query<any, any>({
            query: () => "/dashboard/stats",
            providesTags: ["Dashboard"],
        }),

        // Stock Items
        getStockItems: builder.query<StockItem[], { shopType?: string }>({
            query: (params) => ({
                url: "/stock",
                params,
            }),
            providesTags: ["Stock"],
        }),
        createStockItem: builder.mutation<StockItem, Partial<StockItem>>({
            query: (data) => ({
                url: "/stock",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Stock", "Dashboard"],
        }),
        updateStockItem: builder.mutation<
            StockItem,
            { id: string; data: Partial<StockItem> }
        >({
            query: ({ id, data }) => ({
                url: `/stock/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Stock", "Dashboard"],
        }),
        deleteStockItem: builder.mutation<void, string>({
            query: (id) => ({
                url: `/stock/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Stock", "Dashboard"],
        }),

        // Products
        getProducts: builder.query<Product[], { shopType?: string }>({
            query: (params) => ({
                url: "/products",
                params,
            }),
            providesTags: ["Product"],
        }),
        createProduct: builder.mutation<Product, Partial<Product>>({
            query: (data) => ({
                url: "/products",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Product"],
        }),
        updateProduct: builder.mutation<
            Product,
            { id: string; data: Partial<Product> }
        >({
            query: ({ id, data }) => ({
                url: `/products/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Product"],
        }),
        deleteProduct: builder.mutation<void, string>({
            query: (id) => ({
                url: `/products/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Product"],
        }),

        // Bills
        createBill: builder.mutation<Bill, Partial<Bill>>({
            query: (data) => ({
                url: "/bills",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Bill", "Dashboard"],
        }),
        getBills: builder.query<
            Bill[],
            { shopType?: string }
        >({
            query: (params) => ({
                url: "/bills",
                params,
            }),
            providesTags: ["Bill"],
        }),

        // Stock Updates
        createStockUpdate: builder.mutation<StockUpdate, Partial<StockUpdate>>({
            query: (data) => ({
                url: "/stock-updates",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["StockUpdate", "Stock", "Dashboard"],
        }),
        getStockUpdates: builder.query<
            StockUpdate[],
            { date?: string; shopType?: string; branch?: string }
        >({
            query: (params) => ({
                url: "/stock-updates",
                params,
            }),
            providesTags: ["StockUpdate"],
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useGetDashboardStatsQuery,
    useGetStockItemsQuery,
    useCreateStockItemMutation,
    useUpdateStockItemMutation,
    useDeleteStockItemMutation,
    useGetProductsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useCreateBillMutation,
    useGetBillsQuery,
    useCreateStockUpdateMutation,
    useGetStockUpdatesQuery,
} = api;