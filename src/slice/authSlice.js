import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null
};

const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducer: {
        setToken(state, value){     //^ action ~ value
            state.token = value.payload;
        },
    },
})

export const {setToken} = authSlice.actions;
export const authReducer = authSlice.reducer;
// export default authSlice.reducer;