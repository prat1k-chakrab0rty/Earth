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

export default function ChatHeader() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const uid = queryParams.get('uid');
    const [user, setUser] = useState({});

    const navigate = useNavigate();
    var userData = useSelector((state) => state.user.userInfo);
    var socket = useSelector((state) => state.socket.value);

    useEffect(() => {
        const getUserById = async () => {
            try {
                axios.defaults.withCredentials = true;
                const response = await axios.get(API_URL + `/api/user/${uid}`, {
                    withCredentials: true
                });
                setUser(response.data.data);
            } catch (error) {
                console.log(error);
            }

        }
        getUserById();
    }, [uid])
    const handleBackbtn = async (e) => {
        e.preventDefault();
        try {
            axios.defaults.withCredentials = true;
            const response = await axios.put(API_URL + `/api/user/chat/${userData.id}`, { id: 0 }, {
                withCredentials: true
            });
            socket?.emit("refreshBuddy", { id: uid });
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
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        {user.name}
                    </Typography>
                    <Link className='link' to={`/chat?uid=${user.id}`}>
                        <RefreshIcon fontSize="large" className='cp' />
                    </Link>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
