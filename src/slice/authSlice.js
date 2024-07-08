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
            const token = value.payload;
            state.token = token;
            localStorage.setItem("token", JSON.stringify(token));
        },
        setLoading(state, value){
            state.loading= value.payload
        },
        setSignupData(state, value){
            state.signupData = value.payload
        },
        logout(state) {
            state.token = null;
            localStorage.removeItem("token");
        }
    },
})

export const {setToken,setLoading, setSignupData, logout} = authSlice.actions;
export const authReducer = authSlice.reducer;
// export default authSlice.reducer;



