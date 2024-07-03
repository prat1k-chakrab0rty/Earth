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
import { Avatar, Button, Chip, Skeleton } from '@mui/material';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import DoneIcon from '@mui/icons-material/Done';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

export default function ChatBody({ user }) {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const uid = queryParams.get('uid');

    const audioRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [toMeMessages, setToMeMessages] = useState([]);
    const [isComeToChatRequest, setIsComeToChatRequest] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [buddyIsTyping, setBuddyIsTyping] = useState(false);

    var userData = useSelector((state) => state.user.userInfo);
    var socket = useSelector((state) => state.socket.value);


    useEffect(() => {
        setMessages([]);
        setToMeMessages([]);
    }, [location])

    useEffect(() => {
        const handleIncomingMessage = (message) => {
            setBuddyIsTyping(false);
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setMessages((prevMessages) => [...prevMessages, message]);
            setToMeMessages((prevMessages) => [...prevMessages, false]);
            audioRef.current.play();
        };
        const handleIsTyping = () => {
            setBuddyIsTyping(true);
        }
        const handleStoppedTyping = () => {
            setBuddyIsTyping(false);
        }
        socket?.on("incoming_message", handleIncomingMessage);
        socket?.on("showSkeleton", handleIsTyping);
        socket?.on("hideSkeleton", handleStoppedTyping);

        return () => {
            socket?.off("incoming_message");
            socket?.off("showSkeleton");
            socket?.off("hideSkeleton");
        };
    }, [socket]);

    useEffect(() => {
        if (isTyping)
            socket?.emit("isTyping", { id: user.id });
        else
            socket?.emit("leftTyping", { id: user.id });
    }, [isTyping]);


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
        setIsTyping(true);

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
        }, 1000);
    }
    const handleAskUserToEnterChat = (e) => {
        e.preventDefault();
        socket?.emit("askUserToEnterChat", { id: user.id });
        setIsComeToChatRequest(true);
    }

    return (
        <div className="chat">
            <audio ref={audioRef} src={alert} />
            <div className="chat-wrapper">
                <div className={'message-box' + (messages.length == 0 && !buddyIsTyping ? '' : ' box-reverse')}>
                    {buddyIsTyping && <div className='skltn'>
                        <Avatar alt="Remy Sharp" src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${user.email}`} />
                        <Skeleton variant="text" sx={{ fontSize: '3rem' }} width={300} />
                    </div>}
                    {messages.length != 0 && user.inchat != userData.id && (<>
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: "5px", marginTop: "5px" }}>
                            <Chip color='secondary' label={`${String(user.name).split(' ')[0]} has left the chat.`} />
                        </div>
                    </>)
                    }
                    {messages.length != 0 && messages.slice().reverse().map((message, i) => (
                        <Message key={i} me={toMeMessages.slice().reverse()[i]} value={message} email={toMeMessages.slice().reverse()[i] ? userData.email : user.email} />
                    ))}
                    {messages.length === 0 && !buddyIsTyping && (
                        <div>{user.isActive ? (
                            user.inchat === userData.id ? (
                                <h3>Type 'hi' and send!</h3>
                            ) : (
                                <div>
                                    <h3>{String(user.name).split(' ')[0]} is not in your chat</h3>
                                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                        {isComeToChatRequest ? (
                                            <Chip color='secondary' label="Wait for a while till he/she enters your chat." />
                                        ) : (
                                            <div>
                                                <Button onClick={handleAskUserToEnterChat} color="secondary" variant="contained">
                                                    Ask him/her to enter your chat
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        )
                            :
                            (
                                <>
                                    <h3>{`Oops! ${String(user.name).split(' ')[0]} is offline.`}</h3>
                                    <p className='bounce'>
                                        🙄
                                    </p>
                                </>
                            )
                        }
                        </div>
                    )}
                </div>
                <div className="textarea">
                    <input autoFocus spellCheck='false' onChange={handleMessage} onKeyUp={onPressEnter} value={message} className='chat-input-box' type='text' />
                    <button onClick={onClickSend} type='button'><SendIcon /></button>
                </div>
            </div>
        </div>
    )
}
