import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from "axios";
import API_URL from '../public/key';

const userInitialState = {
    error: null,
    userInfo: null,
    pending: null
};

export const fetchUser = createAsyncThunk('/user/fetchUser', async (req,thunkAPI) => {
    try {
        axios.defaults.withCredentials = true;
        const response = await axios.post(API_URL + '/api/auth/login', req)
        return response.data;
    } catch (error) {
        console.log(error.response.data);
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
})

export const handleLogOut = createAsyncThunk('/user/handleLogout', async (req,thunkAPI) => {
    try {
        axios.defaults.withCredentials = true;
        const response = await axios.post(API_URL + '/api/auth/logout')
        return response.data;
    } catch (error) {
        throw thunkAPI.rejectWithValue(error);
    }
})

const userSlice = createSlice({
    name: 'user',
    initialState: userInitialState,
    reducers: {
    },
    extraReducers: builder => {
        builder
            .addCase(fetchUser.pending, (state, action) => {
                state.pending = true;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                var newUser = {}
                newUser = action.payload.data;
                state.userInfo = newUser
                state.pending = false
                state.error = null
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.pending = false;
                console.log(action);
                state.error = action.payload;
                state.userInfo = null;
            })
            .addCase(handleLogOut.pending, (state, action) => {
                state.pending = true
            })
            .addCase(handleLogOut.fulfilled, (state, action) => {
                state.userInfo = null
                state.pending = false
            })
            .addCase(handleLogOut.rejected, (state, action) => {
                state.pending = false
                state.error = action.payload
            })
    }
})

export default userSlice.reducer