import React from 'react';
import Navbar from '../components/Navbar'
import Body from '../components/Body';
import { Alert } from '@mui/material';
import { Link } from 'react-router-dom';
import SocketInitializer from '../components/SocketInitializer';

const Home = () => {
    return (
        <>
            <SocketInitializer />
            <Navbar />
            <Alert sx={{ display: 'flex', justifyContent: 'center' }} severity="info"><b>A new cool feature added. Click <Link to="/info">here</Link> to know more.</b></Alert>
            <Body />
        </>
    )
}

export default Home