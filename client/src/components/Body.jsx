import React, { useEffect, useRef } from 'react';
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
import { clearUser, handleLogOut } from '../redux/userSlice';
import alert from '../public/wanna-chat.mp3';
import { clearSocket } from '../redux/socketSlice';

export default function Body() {
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [chatAlert, setChatAlert] = useState(false);
    const [chatAlertUserData, setChatAlertUserData] = useState({});
    const navigate = useNavigate();
    const dispatch = useDispatch();
    var userData = useSelector((state) => state.user.userInfo);
    var socket = useSelector((state) => (state.socket.value));
    var pending = useSelector((state) => state.user.pending);

    const audioRef = useRef(null);


    useEffect(() => {
        const getAllUsers = async (uid) => {
            try {
                if (userData && socket && !pending && uid != userData.id) {
                    axios.defaults.withCredentials = true;
                    const response = await axios.get(API_URL + '/api/user/all', {
                        withCredentials: true
                    });
                    response.data.data.map(user => {
                        if (user.id == userData.id)
                            user.isActive = true;
                        return user;
                    })
                    setUsers(response.data.data);
                }
            } catch (error) {
                // console.log(error);
                socket?.emit("logout", { id: userData.id });
                socket?.disconnect();
                dispatch(clearSocket());
                // console.log(socket);
                dispatch(handleLogOut());
            }
        }
        const getBuddyUserData = (user) => {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setChatAlertUserData(user);
            setChatAlert(true);
            audioRef?.current?.play();
        }
        socket?.on("refreshAllExcept", getAllUsers);
        socket?.on("refresh", getAllUsers);
        socket?.on("enterMyChatBuddy", getBuddyUserData);
        getAllUsers(-1);
        return () => {
            socket?.off("refreshAllExcept");
            socket?.off("refresh");
            socket?.off("enterMyChatBuddy");
        };
    }, [socket])
    // useEffect(() => {
    //     if (!userData){
    //         navigate("/login");
    //     }
    // }, [userData])

    const openSnackbar = () => {
        setOpen(true);
    }
    const handleClose = (event, reason) => {
        setOpen(false);
    };
    const handleCloseChatAlert = (event, reason) => {
        setChatAlert(false);
    };
    const openChatPage = (uid) => {
        if (userData?.id === uid) {
            openSnackbar();
        }
        else {
            navigate(`/chat?uid=${uid}`);
        }
    }
    const openUsersChat = () => {
        setChatAlert(false);
        navigate(`/chat?uid=${chatAlertUserData.id}`);

    }
    // console.log(users);
    return (
        <>
            <audio ref={audioRef} src={alert}></audio>
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
                                    {user.inchat != userData?.id &&
                                        (user.isActive
                                            ?
                                            <CircleIcon sx={{ color: "#00FF40" }} />
                                            :
                                            <Typography sx={{ height: '17px', mb: '5px', pt: '5px' }} gutterBottom variant="p" component="div">
                                                Online <b><ReactTimeAgo date={new Date(user?.lastOnline)} locale="en-US" />.</b>
                                            </Typography>
                                        )
                                    }
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
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    open={open}
                    autoHideDuration={3000}
                    message={<Typography>hi {userData?.name.split(' ')[0]}! {userData?.id == 2 ? "Pratik loves you a lot😘" : "Earth likes you."}</Typography>}
                    onClose={handleClose}
                />
                <Snackbar
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    open={chatAlert}
                    onClick={openUsersChat}
                    message={<Typography>{chatAlertUserData.name} wants to chat with you!</Typography>}
                    onClose={handleCloseChatAlert}
                    ContentProps={{
                        sx: {
                            backgroundColor: '#9c27b0',
                            cursor: 'pointer'
                        },
                    }}
                />
            </div>
        </>
    )
}
