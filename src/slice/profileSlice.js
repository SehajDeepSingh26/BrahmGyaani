import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
};

const profileSlice = createSlice({
    name: "profle",
    initialState: initialState,
    reducer: {
        setUser(state, action){     //^ action ~ value
            state.user = action.payload;
        },
    },
})

export const {setToken} = profileSlice.actions;
export const profileReducer = profileSlice.reducer;
// export default authSlice.reducer;