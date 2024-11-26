import { createSlice } from "@reduxjs/toolkit";


const initialState = {
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

const reciverSlice = createSlice({
    name: "reciver",
    initialState,
    reducers: {
        assign: (state, action) => {
            state.email = action.payload.email;
            state.displayName = action.payload.displayName;
            state.avatar = action.payload.avatar;
            state.uid = action.payload.uid;
            state.isOnline = action.payload.isOnline;
            state.lastSeen = action.payload.lastSeen;
        },
        clear: (state) => {
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


export const selectReciver = (state: { reciver: typeof initialState }) => state.reciver;

export const {
    assign,
    clear,
} = reciverSlice.actions

export default reciverSlice.reducer