import React from 'react'
import Navbar from '../components/Navbar'
import { Container, Typography } from '@mui/material'
import CircleIcon from '@mui/icons-material/Circle';
import { Link } from 'react-router-dom';
import SocketInitializer from '../components/SocketInitializer';



export default function Info() {
    return (
        <>
            <SocketInitializer />
            <Navbar />
            <Container>
                <Typography sx={{ mt: 4, textAlign: 'center' }} variant='h4'>Realtime online and inchat status feature added.</Typography>
                <Typography variant='h5' sx={{ mt: 5 }}>Now against each card you may see circle icons <CircleIcon sx={{ color: '#00FF40', verticalAlign: 'middle' }} /> , < CircleIcon color='secondary' sx={{ verticalAlign: 'middle' }} />.</Typography>
                <Typography variant='h5' sx={{ mt: 3, mb: 10 }}>When you land to homepage you'll see all the humans in the earth each by their cards.</Typography>
                <Typography variant='h5'><CircleIcon sx={{ color: '#00FF40', verticalAlign: 'middle' }} /> <b>Online</b></Typography>
                <Typography variant='p' sx={{ fontSize: 22 }}>If you see this green dot,that does mean that human is online now. </Typography>
                <Typography variant='h5' sx={{ mt: 2 }}>< CircleIcon color='secondary' sx={{ verticalAlign: 'middle' }} /> <b>Inchat</b></Typography>
                <Typography variant='p' sx={{ fontSize: 22 }}>If you see this purple dot,that does mean that human is inside your chat.That means that person is waiting for you and once you enter in that chat you both can chat hassle-free. </Typography>

                <Typography variant='h1' sx={{ fontSize: 21, mt: 10 }}>These status changes on realtime, so it has much more significance in this earth.😊 </Typography>
                <Typography variant='h1' sx={{ fontSize: 21, mt: 15,textAlign:'center' }}>With ❤️ from <b>Earth</b></Typography>
                <p className='info-link'><Link to="/" className='link2'>Go back to homepage.</Link></p>
            </Container>
        </>
    )
}
