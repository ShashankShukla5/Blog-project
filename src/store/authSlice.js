import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: false,
    userData: null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.status = true,
            state.useData = action.payload
        },
        logout: (state)=>{
            state.status = false,
            state.useData = null
        }
    }
})

export const {login, logout} = authSlice.actions;

export default authSlice.reducer