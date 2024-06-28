import React from 'react'
import ChatHeader from '../components/ChatHeader'
import ChatBody from '../components/ChatBody'
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { API_URL } from '../public/key';

function Chat() {
    var userData = useSelector((state) => state.user.userInfo);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const uid = queryParams.get('uid');
    var socket = useSelector((state) => state.socket.value);

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
        goToChatRoom();
    }, [uid])
    return (
        <>
            <ChatHeader />
            <ChatBody />
        </>
    )
}

export default Chat