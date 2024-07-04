import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import SocketInitializer from '../components/SocketInitializer';
import CallEndIcon from '@mui/icons-material/CallEnd';
import MicOffIcon from '@mui/icons-material/MicOff';
import CallEnd from '@mui/icons-material/CallEnd';
import CallIcon from '@mui/icons-material/Call';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import { Link, useNavigate } from 'react-router-dom';
import AddIcCallIcon from '@mui/icons-material/AddIcCall';
import ringTone from "../public/ringtone.mp3"
import ringing from "../public/ringing.mp3"
import axios from 'axios';
import { API_URL } from '../public/key';
import { Tooltip } from '@mui/material';

export default function Call() {
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [peerConnection, setPeerConnection] = useState(null);
    const [barClass, setBarClass] = useState('call-bars');
    const [callAccpeted, setCallAccpeted] = useState(false);

    const callingRef = useRef(null);
    const ringingRef = useRef(null);

    const navigate = useNavigate();
    const socket = useSelector((state) => state.socket.value);
    var userData = useSelector((state) => state.user.userInfo);
    const [user, setUser] = useState({});

    const queryParams = new URLSearchParams(location.search);
    const uid = queryParams.get('uid');
    const isReq = queryParams.get('req');

    const servers = {
        iceServers: [
            {
                urls: 'stun:stun.l.google.com:19302',
            },
        ],
        iceCandidatePoolSize: 10,
    };

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

    useEffect(() => {
        if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream;
        }
        if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [localStream, remoteStream, callAccpeted]);

    useEffect(() => {
        if (!socket) {
            return;
        }

        const pc = new RTCPeerConnection(servers);
        setPeerConnection(pc);

        socket.on('offer', async (data) => {
            await pc.setRemoteDescription(new RTCSessionDescription(data));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            socket.emit('answer', answer);
        });

        socket.on('answer', async (data) => {
            await pc.setRemoteDescription(new RTCSessionDescription(data));
        });

        socket.on('candidate', async (data) => {
            try {
                await pc.addIceCandidate(new RTCIceCandidate(data));
            } catch (error) {
                console.error('Error adding received ice candidate', error);
            }
        });


        socket.on('callAccepted', () => {
            try {
                callingRef.current.pause();
                setCallAccpeted(true);
            } catch (error) {
                console.error(error);
            }
        });

        socket.on('endCall', () => {
            try {
                // Stop all tracks on the local stream
                if (localStream) {
                    localStream.getTracks().forEach(track => track.stop());
                }
                // Stop all tracks on the remote stream
                if (remoteStream) {
                    remoteStream.getTracks().forEach(track => track.stop());
                }
                // Close the peer connection
                if (peerConnection) {
                    peerConnection.close();
                }
                navigate(`/chat?uid=${uid}`);
            } catch (error) {
                console.error(error);
            }
        });



        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit('candidate', event.candidate);
            }
        };

        pc.ontrack = (event) => {
            setRemoteStream(event.streams[0]);
            remoteVideoRef.current.srcObject = event.streams[0];
        };

        const startStream = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                localVideoRef.current.srcObject = stream;
                setLocalStream(stream);

                stream.getTracks().forEach((track) => {
                    pc.addTrack(track, stream);
                });


                if (isReq == 'true') {
                    callingRef.current.pause();
                    socket?.emit("videoCallRequest", { myId: userData?.id, buddyId: uid });
                    callingRef.current.currentTime = 0;
                    callingRef.current.play();
                }
                else {
                    ringingRef.current.pause();
                    ringingRef.current.currentTime = 0;
                    ringingRef.current.play();
                }


            } catch (error) {
                console.error('Error accessing media devices', error);
            }
        };

        startStream();

        return () => {
            pc.close();
            socket.off('offer');
            socket.off('answer');
            socket.off('candidate');
            socket.off('callAccepted');
            socket.off('endCall');
        };
    }, [socket]);

    const createOffer = async () => {
        if (!peerConnection) {
            console.error('PeerConnection is not initialized');
            return;
        }
        try {
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
            if (socket) {
                socket.emit('offer', offer);
            } else {
                console.error('Socket is not initialized');
            }
            //handle ringtone and ringing tone off
            ringingRef.current.pause();
            setCallAccpeted(true);
            socket?.emit("callAccepted", { id: uid });
        } catch (error) {
            console.error('Error creating offer', error);
        }
    };


    var timeoutId;
    const handleBars = () => {
        setBarClass('call-bars');
        clearTimeout(timeoutId);

        // Set a timeout to trigger the custom event if the mouse stops moving for 300ms
        timeoutId = setTimeout(function () {
            setBarClass('call-bars hide-call-bars');
        }, 2000);
    }

    const handleEndCall = () => {
        socket?.emit("endCall", { myId: userData?.id, buddyId: uid });
        // Stop all tracks on the local stream
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
        }
        // Stop all tracks on the remote stream
        if (remoteStream) {
            remoteStream.getTracks().forEach(track => track.stop());
        }
        // Close the peer connection
        if (peerConnection) {
            peerConnection.close();
        }
        navigate(`/chat?uid=${uid}`);
    };

    return (
        <div style={{ position: 'relative', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <SocketInitializer />
            {/* <video onMouseMove={handleBars} ref={callAccpeted ? remoteVideoRef : localVideoRef} autoPlay muted={!callAccpeted} style={{ height: '100%', objectFit: 'cover', width: '80vw' }}></video>
            <video onMouseMove={handleBars} style={{ position: 'absolute', width: '300px', top: 25, zIndex: 100, right: 25 }} ref={callAccpeted ? localVideoRef : remoteVideoRef} autoPlay muted={callAccpeted}></video> */}

            {callAccpeted ? (
                <>
                    <video
                        onMouseMove={handleBars}
                        ref={remoteVideoRef}
                        autoPlay
                        style={{ height: '100%', objectFit: 'cover', width: '80vw' }}
                    ></video>
                    <video
                        onMouseMove={handleBars}
                        ref={localVideoRef}
                        autoPlay
                        muted
                        style={{ position: 'absolute', width: '300px', top: 25, zIndex: 100, right: 25 }}
                    ></video>
                </>
            ) : (
                <>
                    <video
                        onMouseMove={handleBars}
                        ref={localVideoRef}
                        autoPlay
                        muted
                        style={{ height: '100%', objectFit: 'cover', width: '80vw' }}
                    ></video>
                    <video
                        onMouseMove={handleBars}
                        ref={remoteVideoRef}
                        autoPlay
                        style={{ position: 'absolute', width: '300px', top: 25, zIndex: 100, right: 25 }}
                    ></video>
                </>
            )}


            {(isReq == 'true' || callAccpeted) ? (<>
                {!callAccpeted && (<div className='calling-div'>
                    <img className='call-logo' src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${user?.email}`} alt="avatar" />
                    <p className='user-name'>{user.name}</p>
                    <p>Ringing...</p>
                </div>)}
                <div onMouseMove={handleBars} className={barClass}>
                    <audio ref={callingRef} src={ringing} loop></audio>
                    <Tooltip arrow title="Turn Off Audio">
                        <MicOffIcon fontSize='large' sx={{ cursor: 'pointer', color: 'lightgray' }} />
                    </Tooltip>
                    <Tooltip arrow title="Turf Off Video">
                        <VideocamOffIcon fontSize='large' sx={{ cursor: 'pointer', color: 'lightgray' }} />
                    </Tooltip>
                    <Tooltip arrow title="End Call">
                        <CallEndIcon onClick={handleEndCall} fontSize='large' sx={{ cursor: 'pointer', color: 'red' }} />
                    </Tooltip>
                </div>
            </>
            )
                :
                (
                    <>
                        {!callAccpeted && (<div className='calling-div'>
                            <img className='call-logo' src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${user?.email}`} alt="avatar" />
                            <p className='user-name'>{user.name}</p>
                            <p>Calling...</p>
                        </div>)}
                        <div className='call-bars'>
                            <audio ref={ringingRef} src={ringTone} loop></audio>
                            <Tooltip arrow title="Answer Call">
                                <CallIcon fontSize='large' sx={{ cursor: 'pointer', color: '#0FFF50' }} onClick={createOffer} />
                            </Tooltip>
                            <Tooltip arrow title="End Call">
                                <Link className='link' to={`/chat?uid=${uid}`}>
                                    <CallEndIcon fontSize='large' sx={{ cursor: 'pointer', color: 'red' }} />
                                </Link>
                            </Tooltip>
                        </div>
                    </>
                )}
        </div>
    );
}
