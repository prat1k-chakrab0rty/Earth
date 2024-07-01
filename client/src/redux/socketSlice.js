import { createSlice } from '@reduxjs/toolkit';


const socketSlice = createSlice({
    name: 'socket',
    initialState: {
        value: null
    },
    reducers: {
        setSocket(state, action) {
            state.value = action.payload
        },
        clearSocket(state) {
            state.value = null
        }
    },
})

export const { setSocket, clearSocket } = socketSlice.actions

export default socketSlice.reducer