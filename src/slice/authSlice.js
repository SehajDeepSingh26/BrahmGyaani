import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    signupData: null,
    loading: false,
    token: localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null
};

const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        setToken(state, value){     //^ action ~ value
            state.token = value.payload;
        },
        setLoading(state, value){
            state.loading= value.payload
        },
        setSignupData(state, value){
            state.signupData = value.payload
        }
    },
})

export const {setToken,setLoading, setSignupData} = authSlice.actions;
export const authReducer = authSlice.reducer;
// export default authSlice.reducer;



