import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import SocketInitializer from '../components/SocketInitializer';

export default function Call() {
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const [localStream, setLocalStream] = useState(null);
    const [peerConnection, setPeerConnection] = useState(null);

    const socket = useSelector((state) => state.socket.value);

    const servers = {
        iceServers: [
            {
                urls: 'stun:stun.l.google.com:19302',
            },
        ],
        iceCandidatePoolSize: 10,
    };

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

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit('candidate', event.candidate);
            }
        };

        pc.ontrack = (event) => {
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
        } catch (error) {
            console.error('Error creating offer', error);
        }
    };

    return (
        <div>
            <SocketInitializer />
            <video ref={localVideoRef} autoPlay muted style={{ width: '300px' }}></video>
            <video ref={remoteVideoRef} autoPlay style={{ width: '300px' }}></video>
            <button onClick={createOffer}>Start Call</button>
        </div>
    );
}
