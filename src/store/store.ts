import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth.slice';
import reciverReducer from './slices/reciver.slice';
const store = configureStore({
    reducer: {
        auth: authReducer,
        reciver: reciverReducer
    },
});

export default store;
