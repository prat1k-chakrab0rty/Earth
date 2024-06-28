import React, { useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, Chip, Snackbar } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import { useState } from 'react';
import axios from 'axios';
import ReactTimeAgo from 'react-time-ago';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { API_URL } from '../public/key';
import { lightGreen } from '@mui/material/colors';
import { clearUser } from '../redux/userSlice';

export default function Body() {
    const vertical = 'top';
    const horizontal = 'center';
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    var userData = useSelector((state) => state.user.userInfo);
    var socket = useSelector((state) => state.socket.value);
    const dispatch=useDispatch();
    useEffect(() => {
        const getAllUsers = async () => {
            try {
                axios.defaults.withCredentials = true;
                const response = await axios.get(API_URL + '/api/user/all', {
                    withCredentials: true
                });
                setUsers(response.data.data);
            } catch (error) {
                dispatch((clearUser()));
                navigate("/login");
                console.log(error);
            }
        }
        if (userData && socket)
            getAllUsers();
        socket?.on("refresh", getAllUsers);
    }, [socket])

    const openSnackbar = () => {
        setOpen(true);
    }
    const handleClose = (event, reason) => {
        setOpen(false);
    };
    const openChatPage = (uid) => {
        if (userData?.id === uid) {
            openSnackbar();
        }
        else {
            navigate(`/chat?uid=${uid}`);
        }
    }
    console.log(users);
    return (
        <>
            <div className="container">
                <div className="wrapper">
                    {users.map(user => (
                        <Card key={user?.id} sx={{ width: 345 }}>
                            <CardActionArea onClick={() => openChatPage(user?.id)}>
                                {/* <CardMedia
                                    component="img"
                                    height="140"
                                    image=
                                    alt="green iguana"
                                /> */}
                                <img className='card-logo' src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${user?.email}`} alt="logo" />
                                <CardContent sx={{ mt: 0, pt: 0 }}>
                                    <CircleIcon sx={{ color: (user.isActive?"#00FF40":'white') }} />
                                    {user.inchat == userData?.id && < CircleIcon color='secondary' />}
                                    <Typography gutterBottom variant="h5" component="div">
                                        {user?.name}
                                    </Typography>
                                    <Typography gutterBottom variant="p" component="div" sx={{ fontSize: 15 }}>
                                        Born <b><ReactTimeAgo date={new Date(user?.date)} locale="en-US" />.</b>
                                    </Typography>
                                    {/* <Typography variant="body2" color="text.secondary">
                                        Lizards are a widespread group of squamate reptiles, with over 6,000
                                        species, ranging across all continents except Antarctica
                                    </Typography> */}
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    ))}
                </div>
                <Snackbar
                    anchorOrigin={{ vertical, horizontal }}
                    open={open}
                    autoHideDuration={3000}
                    message={<Typography>hi {userData?.name.split(' ')[0]}! {userData?.id == 2 ? "Pratik loves you a lot😘" : "Earth likes you."}</Typography>}
                    onClose={handleClose}
                />
            </div>
        </>
    )
}
