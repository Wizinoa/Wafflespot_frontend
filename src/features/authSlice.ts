import { createSlice } from "@reduxjs/toolkit";

interface User {
    id: string;
    name: string;
    role: "ADMIN" | "USER" | "BOTH";
    shopName?: string;
    businessType?: string;
    category?: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
}

const savedAuth = localStorage.getItem("auth");
let initialAuthState: AuthState = { user: null, token: null };

if (savedAuth) {
    try {
        initialAuthState = JSON.parse(savedAuth);
    } catch (e) {
        console.error("Failed to parse auth from localStorage", e);
    }
}

const initialState: AuthState = initialAuthState;

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;

            localStorage.setItem("auth", JSON.stringify(action.payload));
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem("auth");
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;