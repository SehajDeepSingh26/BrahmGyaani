import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null


};

const profileSlice = createSlice({
    name: "profle",
    initialState: initialState,
    reducers: {
        setUser(state, action){     //^ action ~ value
            state.user = action.payload;
            localStorage.setItem("user", JSON.stringify(action.payload));
        },
        setLoading(state, value){
            state.loading= value.payload
        },
    },
})

export const {setUser, setLoading} = profileSlice.actions;
export const profileReducer = profileSlice.reducer;
// export default authSlice.reducer;