import React from 'react'
import { Avatar } from '@mui/material'
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import API_URL from '../public/key';
export default function Message({ me, value }) {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const uid = queryParams.get('uid');
    const [user, setUser] = useState({});
    var userData = useSelector((state) => state.user.userInfo);
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
    }, [])
    return (
        <div className={`message ${me && 'me'}`}>
            <Avatar alt="Remy Sharp" src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${me?userData.email:user.email}`} />
            <div className="text">{value}</div>
        </div>
    )
}
