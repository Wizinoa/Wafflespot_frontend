import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface BranchState {
    selectedBranch: string | null;
}

const initialState: BranchState = {
    selectedBranch: localStorage.getItem("selectedBranch") || null,
};

const branchSlice = createSlice({
    name: "branch",
    initialState,
    reducers: {
        setBranch: (state, action: PayloadAction<string>) => {
            state.selectedBranch = action.payload;
            localStorage.setItem("selectedBranch", action.payload);
        },
        clearBranch: (state) => {
            state.selectedBranch = null;
            localStorage.removeItem("selectedBranch");
        },
    },
});

export const { setBranch, clearBranch } = branchSlice.actions;
export default branchSlice.reducer;