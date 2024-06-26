import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import socketReducer from "./socketSlice";
import { persistStore, persistReducer } from 'redux-persist';
import {thunk} from 'redux-thunk';
import storage from "redux-persist/lib/storage";



const persistConfig = {
    key: 'user',
    storage,
}

const persistedReducer = persistReducer(persistConfig, userReducer);

const store = configureStore({
    reducer: {
        user:  persistedReducer,
        socket: socketReducer
    },
    devTools:true,
    middleware:  (getDefaultMiddleware) => getDefaultMiddleware(
        {
            serializableCheck: false,
        }
    ).concat(thunk)
})

// Can still subscribe to the store
// store.subscribe(() => console.log(store.getState()))

export default store;

export const persistor = persistStore(store)