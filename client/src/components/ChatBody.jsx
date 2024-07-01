import React, { useRef, useState } from 'react'
import Message from './Message';
import SendIcon from '@mui/icons-material/Send';
import { io } from "socket.io-client";
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import alert from '../public/message-alert.mp3';
import { API_URL, SK_URL } from '../public/key';
import axios from 'axios';

export default function ChatBody({ user }) {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const uid = queryParams.get('uid');

    const audioRef = useRef(null);

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [toMeMessages, setToMeMessages] = useState([]);

    var userData = useSelector((state) => state.user.userInfo);
    var socket = useSelector((state) => state.socket.value);


    useEffect(() => {
        setMessages([]);
        setToMeMessages([]);
    }, [location])

    useEffect(() => {
        const handleIncomingMessage = (message) => {
            audioRef.current.pause();
            audioRef.current.currentTime=0;
            setMessages((prevMessages) => [...prevMessages, message]);
            setToMeMessages((prevMessages) => [...prevMessages, false]);
            audioRef.current.play();
        };

        socket?.on("incoming_message", handleIncomingMessage);

        return () => {
            socket?.off("incoming_message", handleIncomingMessage);
        };
    }, [socket]);



    const handleSend = (e) => {
        e.preventDefault();
        if (message != "") {
            socket?.emit("outgoing_message", { message, id: uid });
            setMessages((prevMessages) => [...prevMessages, message]);
            setToMeMessages((prevMessages) => [...prevMessages, true]);
            setMessage("");
        }
    }
    const onClickSend = (e) => {
        handleSend(e);
    }
    const onPressEnter = (e) => {
        if (e.key == 'Enter') {
            handleSend(e);
        }
    }
    const handleMessage = (e) => {
        setMessage(e.target.value);
    }
    return (
        <div className="chat">
            <audio ref={audioRef} src={alert} />
            <div className="chat-wrapper">
                <div className={'message-box' + (messages.length == 0 ? '' : ' box-reverse')}>
                    {messages.length != 0 && messages.slice().reverse().map((message, i) => (
                        <Message key={i} me={toMeMessages.slice().reverse()[i]} value={message} email={toMeMessages.slice().reverse()[i] ? userData.email : user.email} />
                    ))}
                    {messages.length == 0 && <div>
                        <h3>Type 'hi' and send!</h3>
                    </div>}
                </div>
                <div className="textarea">
                    <input autoFocus spellCheck='false' onChange={handleMessage} onKeyUp={onPressEnter} value={message} className='chat-input-box' type='text' />
                    <button onClick={onClickSend} type='button'><SendIcon /></button>
                </div>
            </div>
        </div>
    )
}
