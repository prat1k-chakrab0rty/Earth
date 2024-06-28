import React, { useState } from 'react'
import Message from './Message';
import SendIcon from '@mui/icons-material/Send';
import { io } from "socket.io-client";
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { API_URL, SK_URL } from '../public/key';
import axios from 'axios';

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

    const [user, setUser] = useState({});
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [toMeMessages, setToMeMessages] = useState([]);
    const [skt, setSkt] = useState(null);

    var userData = useSelector((state) => state.user.userInfo);
    useEffect(() => {
        const socket = io(SK_URL, {
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

    const handleSend = (e) => {
        e.preventDefault();
        if (message != "") {
            skt?.emit("outgoing_message", { message, id: uid });
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
