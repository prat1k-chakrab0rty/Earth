import React, { useState } from 'react'
import Message from './Message';
import SendIcon from '@mui/icons-material/Send';
import { io } from "socket.io-client";
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

export default function ChatBody() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const uid = queryParams.get('uid');
    useEffect(() => {
        // setMessages(Array(10).fill("hello"));
        // setToMeMessages([false, true, false, true, false, true, false, true, false, true]);
        setMessages([]);
        setToMeMessages([]);
    }, [location])

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [toMeMessages, setToMeMessages] = useState([]);
    const [skt, setSkt] = useState(null);

    var userData = useSelector((state) => state.user.userInfo);
    useEffect(() => {
        const socket = io("wss://earthapi.onrender.com", {
            query: {
                id: userData.id
            },
            reconnection: false
        });
        setSkt(socket);
        socket?.on("incoming_message", (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
            setToMeMessages((prevMessages) => [...prevMessages, false]);
        });
    }, [location])



    const handleSend = (e) => {
        e.preventDefault();
        skt?.emit("outgoing_message", { message, id: uid });
        setMessages((prevMessages) => [...prevMessages, message]);
        setToMeMessages((prevMessages) => [...prevMessages, true]);
    }
    const onClickSend = (e) => {
        handleSend(e);
        setMessage("");
    }
    const onPressEnter = (e) => {
        if (e.key == 'Enter') {
            handleSend(e);
            setMessage("");
        }
    }
    const handleMessage = (e) => {
        setMessage(e.target.value);
    }
    return (
        <div className="chat">
            <div className="chat-wrapper">
                <div className="message-box">
                    {messages.length != 0 && messages.map((message, i) => (
                        <Message key={i} me={toMeMessages[i]} value={message} />
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
