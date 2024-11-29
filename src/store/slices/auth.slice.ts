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
    contacts: []
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.email = action.payload.email;
            state.displayName = action.payload.displayName;
            state.avatar = action.payload.avatar;
            state.uid = action.payload.id ?? action.payload.uid;
            state.isOnline = action.payload.isOnline;
            state.lastSeen = action.payload.lastSeen;
            state.contacts = action.payload.contacts
        },
        logout: (state) => {
            state.email = "";
            state.displayName = "";
            state.avatar = "";
            state.uid = "";
            state.isOnline = false;
            state.contacts = []
            state.lastSeen = {
                seconds: 0,
                nanoseconds: 0
            }
        },
        updateUserContacts: (state, action) => {
            state.contacts = action.payload
        }
    },
});
export const selectAuth = (state: { auth: IUser }) => state.auth;
export const {
    login,
    logout,
    updateUserContacts
} = authSlice.actions;



export default authSlice.reducer;
