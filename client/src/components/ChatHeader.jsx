import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';
import { API_URL } from '../public/key';
import { useSelector } from 'react-redux';
import CircleIcon from '@mui/icons-material/Circle';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import CallIcon from '@mui/icons-material/Call';


export default function ChatHeader({ user }) {



    const navigate = useNavigate();
    var userData = useSelector((state) => state.user.userInfo);
    var socket = useSelector((state) => state.socket.value);

    const handleBackbtn = async (e) => {
        e.preventDefault();
        try {
            axios.defaults.withCredentials = true;
            const response = await axios.put(API_URL + `/api/user/chat/${userData.id}`, { id: "0" }, {
                withCredentials: true
            });
            socket?.emit("refreshBuddy", { id: user.id });
            // socket?.emit("refreshBuddy", { id: userData.id });
            navigate("/");
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" color='secondary'>
                <Toolbar>
                    <Link className='link' onClick={handleBackbtn}>
                        <ArrowBackIcon className='cp' sx={{ mr: 2 }} />
                    </Link>
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography sx={{ lineHeight: 1.2 }} variant="h6" component="div">
                            {user.name}
                        </Typography>
                        {user.inchat == userData.id && <Typography sx={{ lineHeight: 1, ml: 3, fontWeight: '500' }}>In your chat</Typography>}
                        {user.isActive && user.inchat != userData.id && <Typography sx={{ lineHeight: 1, ml: 3, fontWeight: '500' }}>Available</Typography>}
                        {!user.isActive && <Typography sx={{ lineHeight: 1, ml: 3, fontWeight: '500' }}>Offline</Typography>}
                    </Box>
                    <Link className='link' to={`/chat?uid=${user.id}`}>
                        <VideoCallIcon sx={{mr:2}} fontSize="large" className='cp' />
                    </Link>
                    <Link className='link' to={`/chat?uid=${user.id}`}>
                        <CallIcon sx={{mr:2}} fontSize="large" className='cp' />
                    </Link>
                    <Link className='link' to={`/chat?uid=${user.id}`}>
                        <RefreshIcon fontSize="large" className='cp' />
                    </Link>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
