import { IUser } from "@/app/types/types";
import { createSlice } from "@reduxjs/toolkit";


const initialState: IUser = {
    email: "",
    displayName: "",
    avatar: "",
    uid: "",
    isOnline: false,
    lastSeen: {
        seconds: 0,
        nanoseconds: 0
    },
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.email = action.payload.email;
            state.displayName = action.payload.displayName;
            state.avatar = action.payload.avatar;
            state.uid = action.payload.id;
            state.isOnline = action.payload.isOnline;
            state.lastSeen = action.payload.lastSeen;
        },
        logout: (state) => {
            state.email = "";
            state.displayName = "";
            state.avatar = "";
            state.uid = "";
            state.isOnline = false;
            state.lastSeen = {
                seconds: 0,
                nanoseconds: 0
            };
        },
    },
});
export const selectAuth = (state: { auth: IUser }) => state.auth;
export const {
    login,
    logout,
} = authSlice.actions;



export default authSlice.reducer;
