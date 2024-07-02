import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { SK_URL } from '../public/key';
import { setSocket } from '../redux/socketSlice';

function SocketInitializer() {
    const dispatch = useDispatch();
    var userData = useSelector((state) => state.user.userInfo);
    var socketState = useSelector((state) => state.socket.value);
    let socket;
    useEffect(() => {
        if (!socket && !socketState && userData) {
            socket = io(SK_URL, {
                query: {
                    id: userData?.id
                },
                reconnection: false,
            });
            dispatch(setSocket(socket));
        }
    }, [userData])

    return null;
}

export default SocketInitializer