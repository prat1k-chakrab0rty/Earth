import React from 'react'
import ChatHeader from '../components/ChatHeader'
import ChatBody from '../components/ChatBody'
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { API_URL } from '../public/key';
import { useState } from 'react';
import SocketInitializer from '../components/SocketInitializer';

function Chat() {
    var userData = useSelector((state) => state.user.userInfo);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const uid = queryParams.get('uid');
    var socket = useSelector((state) => state.socket.value);

    const [user, setUser] = useState({});


    useEffect(() => {
        const goToChatRoom = async () => {
            try {
                axios.defaults.withCredentials = true;
                const response = await axios.put(API_URL + `/api/user/chat/${userData.id}`,{id:uid}, {
                    withCredentials: true
                });
                socket?.emit("refreshBuddy", { id: uid });
            } catch (error) {
                console.log(error);
            }
        }
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
        goToChatRoom();
        socket?.on("refresh", getUserById);
        getUserById();
    }, [uid])
    return (
        <>
            <SocketInitializer />
            <ChatHeader user={user}/>
            <ChatBody user={user}/>
        </>
    )
}

export default Chat