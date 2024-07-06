/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

const initialState = {
    totalItems: localStorage.getItem('totalItems') ? JSON.parse(localStorage.getItem('totalItems')) : 0
};

const cartSlice = createSlice({
    name: "cart",
    initialState: initialState,
    reducer: {
        setTotalItems(state, action){     
            state.totalItems = action.payload;
        },

        addToCart(state, action){
            // state.totalItems = action.payload+1
        },
        removeFromCart(state, action){
            // state.totalItems = action.payload-1
        },
        restCart(state, action){
            // state.totalItems = 0
        },
    },
})

export const {setTotalItems} = cartSlice.actions;
export const cartReducer = cartSlice.reducer;
// export default authSlice.reducer;