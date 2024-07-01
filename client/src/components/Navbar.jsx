import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Tooltip } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { handleLogOut } from '../redux/userSlice';
import { useEffect } from 'react';
import { clearSocket } from '../redux/socketSlice';


export default function ButtonAppBar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    var userData = useSelector((state) => state.user.userInfo);
    var socket = useSelector((state) => state.socket.value);

    const handleLogout = (event) => {
        event.preventDefault();
        socket?.emit("logout", { id: userData.id });
        socket?.disconnect();
        dispatch(clearSocket());
        // console.log(socket);
        dispatch(handleLogOut());
    }
    useEffect(() => {
        // console.log(socket, userData);
        if (!socket && !userData) {
            // console.log("Going to login");
            navigate("/login");
        }
    }, [socket, userData]);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" color='secondary'>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <Link className='link cp' to='/'>The Earth App</Link>
                    </Typography>
                    <Tooltip title={userData?.name}>
                        <img className='nav-logo cp' src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${userData?.email}`} alt="avatar" />
                    </Tooltip>
                    <Button color="inherit" onClick={handleLogout}>Logout</Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
}