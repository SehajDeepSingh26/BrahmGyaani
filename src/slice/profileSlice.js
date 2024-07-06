import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
};

const profileSlice = createSlice({
    name: "profle",
    initialState: initialState,
    reducers: {
        setUser(state, action){     //^ action ~ value
            state.user = action.payload;
        },
    },
})

export const {setUser} = profileSlice.actions;
export const profileReducer = profileSlice.reducer;
// export default authSlice.reducer;