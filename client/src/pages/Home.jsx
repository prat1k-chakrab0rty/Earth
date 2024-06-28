import React from 'react';
import Navbar from '../components/Navbar'
import Body from '../components/Body';
import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { setSocket } from '../redux/socketSlice';
import { SK_URL } from '../public/key';
import { Alert } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
    const dispatch = useDispatch();
    var userData = useSelector((state) => state.user.userInfo);
    useEffect(() => {
        if (userData) {
            const socket = io(SK_URL, {
                query: {
                    id: userData?.id
                },
                reconnection: false
            });
            dispatch(setSocket(socket));
        }
    }, [userData])

    return (
        <>
            <Navbar />
            <Alert sx={{display:'flex',justifyContent:'center'}} severity="info"><b>A new cool feature added. Click <Link to="/info">here</Link> to know more.</b></Alert>
            <Body />
        </>
    )
}

export default Home