import React, { useRef, useState } from 'react'
import Message from './Message';
import SendIcon from '@mui/icons-material/Send';
import { io } from "socket.io-client";
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import alert from '../public/message-alert.mp3';
import { API_URL, SK_URL } from '../public/key';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { Alert, AppBar, Avatar, Button, Chip, Dialog, IconButton, ListItemText, Menu, MenuItem, Skeleton, Snackbar, Toolbar, Tooltip, Typography } from '@mui/material';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import DoneIcon from '@mui/icons-material/Done';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CameraIcon from '@mui/icons-material/Camera';
import { getURLFromFirebase, uploadToFirebase } from '../public/firebaseUtil';


export default function ChatBody({ user }) {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const uid = queryParams.get('uid');

    const audioRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const inputRef = useRef(null);
    const fileInputRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [toMeMessages, setToMeMessages] = useState([]);
    const [isComeToChatRequest, setIsComeToChatRequest] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [buddyIsTyping, setBuddyIsTyping] = useState(false);
    const [showEmojiMart, setShowEmojiMart] = useState(false);
    const [isSelectedImage, setIsSelectedImage] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedImageFile, setSelectedImageFile] = useState(null);
    const [showUnsupportedFileAlert, setShowUnsupportedFileAlert] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const openSendImageBtn = Boolean(anchorEl);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [isCameraPreview, setIsCameraPreview] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const [capturedImageAsFile, setCapturedImageAsFile] = useState(null);

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
        const joinCall = (data) => {
            navigate(`/call?uid=${data.id}&req=false&isAudio=${data.isAudio}`);
        }

        socket?.on("incoming_message", handleIncomingMessage);
        socket?.on("showSkeleton", handleIsTyping);
        socket?.on("hideSkeleton", handleStoppedTyping);
        socket?.on("callAlert", joinCall);

        return () => {
            socket?.off("incoming_message");
            socket?.off("showSkeleton");
            socket?.off("hideSkeleton");
            socket?.off("callAlert");
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
        setShowEmojiMart(false);
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
    const handleMenuClose = () => {
        setAnchorEl(null);
    }
    const handleFileInput = (e) => {
        setAnchorEl(null);
        fileInputRef.current.click();
    }

    const handleFile = async (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            if (file.type.split("/")[0] == "image") {
                setIsSelectedImage(true);
                setSelectedImageFile(file);
                const imageUrl = URL.createObjectURL(file);
                setSelectedImage(imageUrl);
            }
            else {
                setShowUnsupportedFileAlert(true);
            }
        }
    }

    const sendImageAfterPreview = async () => {
        setIsSelectedImage(false);
        const file = selectedImageFile;
        setSelectedImage(null);
        setSelectedImageFile(null);
        fileInputRef.current.value = null;
        await uploadToFirebase(file.type, file);
        const imgURL = await getURLFromFirebase(file.name);
        if (imgURL != "") {
            socket?.emit("outgoing_message", { message: imgURL, id: uid });
            setMessages((prevMessages) => [...prevMessages, imgURL]);
            setToMeMessages((prevMessages) => [...prevMessages, true]);
        }
        handleClose();
    }

    const sendCameraImageAfterPreview = async () => {
        await uploadToFirebase("image", capturedImageAsFile);
        const imgURL = await getURLFromFirebase(capturedImageAsFile.name);
        if (imgURL != "") {
            socket?.emit("outgoing_message", { message: imgURL, id: uid });
            setMessages((prevMessages) => [...prevMessages, imgURL]);
            setToMeMessages((prevMessages) => [...prevMessages, true]);
        }
        setIsCameraOpen(false);
        setIsCameraPreview(false);
        setCapturedImage(null);
        setCapturedImageAsFile(null);
        setAnchorEl(null);
    }

    const handleClose = () => {
        fileInputRef.current.value = null;
        setSelectedImage(null);
        setIsSelectedImage(false);
        setSelectedImageFile(null);
    }

    const handleAlertClose = () => {
        setShowUnsupportedFileAlert(false);
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
    const openCamera = async () => {
        setIsCameraOpen(true);
        setIsCameraPreview(false);
        setCapturedImage(null);
        setCapturedImageAsFile(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoRef.current.srcObject = stream;
            videoRef.current.play();
        } catch (error) {
            console.error('Error accessing camera:', error);
        }
    };
    const captureImage = () => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL('image/png');
        setCapturedImage(imageDataUrl);
        canvas.toBlob(async (blob) => {
            if (blob) {
                // Create a File object from Blob
                const date = new Date();
                const imageFile = new File([blob], `${date.toString()}.png`, { type: 'image/png' });
                setCapturedImageAsFile(imageFile);
            }
            video.srcObject.getTracks().forEach(track => track.stop());
            setIsCameraOpen(false);
            setIsCameraPreview(true);
            handleMenuClose();
        });
    }

    const addEmojiToInput = (emoji) => {
        setMessage(message + emoji.native);
        inputRef.current.focus();
    };

    const handleEmojiPicker = (e) => {
        setShowEmojiMart(!showEmojiMart);
    };

    const handleCameraClose = (e) => {
        setIsCameraOpen(false);
        setIsCameraPreview(false);
        setCapturedImage(null);
        setCapturedImageAsFile(null);
        handleMenuClose();
    };

    const sendImageBtnClick = (event) => {
        setAnchorEl(event.currentTarget);
    }

    return (
        <div className="chat">
            <audio ref={audioRef} src={alert} />
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={showUnsupportedFileAlert}
                autoHideDuration={3000}
                onClose={handleAlertClose}
            >
                <Alert severity="error">Unsupported file type, you can only send images.</Alert>
            </Snackbar>
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
                    <span>
                        <Tooltip arrow title="Send emojis">
                            <SentimentSatisfiedAltIcon color='secondary' onClick={handleEmojiPicker} fontSize='large' sx={{ cursor: 'pointer' }} />
                        </Tooltip>
                        <Tooltip arrow title="Send an image">
                            <AttachFileIcon id="send-image-button" aria-controls={openSendImageBtn ? 'basic-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={openSendImageBtn ? 'true' : undefined} onClick={sendImageBtnClick} color='secondary' fontSize='large' sx={{ cursor: 'pointer' }} />
                        </Tooltip>
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={openSendImageBtn}
                            onClose={handleMenuClose}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                        >
                            {/* Due to some css glitch had to add this fake menu item */}
                            <MenuItem sx={{ display: 'none' }}>Open Gallery</MenuItem>
                            <MenuItem onClick={handleFileInput}><ListItemText sx={{ color: '#9c27b0' }}>Open Gallery</ListItemText></MenuItem>
                            <MenuItem onClick={openCamera}><ListItemText sx={{ color: '#9c27b0' }}>Open Camera</ListItemText></MenuItem>
                        </Menu>
                    </span>
                    <input onChange={handleFile} ref={fileInputRef} hidden type='file' />
                    <input ref={inputRef} autoFocus spellCheck='false' onChange={handleMessage} onKeyUp={onPressEnter} value={message} className='chat-input-box' type='text' />
                    {showEmojiMart && <Picker dynamicWidth="true" autoFocus="false" emojiButtonSize="50" emojiSize="40" searchPosition="none" previewPosition="none" style={{ position: 'absolute', zIndex: 1000 }} data={data} onEmojiSelect={addEmojiToInput} />}
                    <button onClick={onClickSend} type='button'><SendIcon /></button>
                </div>

                {/* Preview Image */}

                <Dialog
                    fullScreen
                    open={isSelectedImage}
                    PaperProps={{
                        sx: {
                            backgroundColor: 'lightgray',
                        },
                    }}
                >
                    <AppBar color='secondary' sx={{ position: 'relative' }}>
                        <Toolbar>
                            <IconButton
                                edge="start"
                                color="inherit"
                                onClick={handleClose}
                                aria-label="close"
                            >
                                <CloseIcon />
                            </IconButton>
                            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                                Send Image
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <img style={{ maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain", margin: 'auto', backgroundColor: 'white' }} src={selectedImage} alt='image' />
                    <div style={{ display: 'flex', justifyContent: 'end', position: 'absolute', bottom: 30, right: 30 }}>
                        <IconButton
                            className='image-preview-send-image'
                            edge="start"
                            onClick={sendImageAfterPreview}
                            aria-label="close"
                        >
                            <SendIcon sx={{ position: 'relative', left: '2px' }} fontSize='large' />
                        </IconButton>
                    </div>
                </Dialog>


                {/* Open Camera */}

                <Dialog
                    fullScreen
                    open={isCameraOpen || isCameraPreview}
                    PaperProps={{
                        sx: {
                            backgroundColor: 'lightgray',
                        },
                    }}
                >
                    <div>
                        {isCameraOpen && <div style={{ display: 'flex', justifyContent: 'center', height: '100vh', alignItems: 'center' }}>
                            <video ref={videoRef} style={{ height: '98vh' }} />
                            <IconButton
                                onClick={handleCameraClose}
                                sx={{ position: 'absolute', top: 20, left: "20%" }}
                                edge="start"
                                color="error"
                                aria-label="close"
                            >
                                <CloseIcon fontSize='large' />
                            </IconButton>
                            <IconButton onClick={captureImage}
                                sx={{ position: 'absolute', bottom: 40 }}
                                className='image-preview-send-image'
                                edge="start"
                                color="inherit"
                                aria-label="close"
                            >
                                <CameraIcon fontSize='large' />
                            </IconButton>
                        </div>}
                        {capturedImage && (
                            <div style={{ display: 'flex', justifyContent: 'center', height: '100vh', alignItems: 'center' }}>
                                <img src={capturedImage} alt="Captured" style={{ height: '98vh' }} />
                                <IconButton
                                    sx={{ position: 'absolute', bottom: 20, right: "20%" }}
                                    className='image-preview-send-image'
                                    edge="start"
                                    onClick={sendCameraImageAfterPreview}
                                    aria-label="close"
                                >
                                    <SendIcon sx={{ position: 'relative', left: '2px' }} fontSize='large' />
                                </IconButton>
                            </div>
                        )}
                        <canvas ref={canvasRef} style={{ display: 'none' }} />
                        <IconButton
                            onClick={handleCameraClose}
                            sx={{ position: 'absolute', top: 20, left: "20%" }}
                            edge="start"
                            color="error"
                            aria-label="close"
                        >
                            <CloseIcon fontSize='large' />
                        </IconButton>
                    </div>
                </Dialog>

            </div>
        </div>
    )
}
