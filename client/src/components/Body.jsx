import React, { useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import { useState } from 'react';
import axios from 'axios';
import API_URL from '../public/key';

export default function Body() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const getAllUsers = async () => {
            try {
                axios.defaults.withCredentials = true;
                const response = await axios.get(API_URL + '/api/user/all', {
                    withCredentials: true
                });
                setUsers(response.data.data);
            } catch (error) {
                console.log(error);
            }

        }
        getAllUsers();
    }, [])

    return (
        <>
            <div className="container">
                <div className="wrapper">
                    {users.map(user => (
                        <Card key={user.id} sx={{ width: 345 }}>
                            <CardActionArea>
                                {/* <CardMedia
                                    component="img"
                                    height="140"
                                    image=
                                    alt="green iguana"
                                /> */}
                                <img className='card-logo' src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${user.email}`} alt="logo" />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {user.name}
                                    </Typography>
                                    {/* <Typography variant="body2" color="text.secondary">
                                        Lizards are a widespread group of squamate reptiles, with over 6,000
                                        species, ranging across all continents except Antarctica
                                    </Typography> */}
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    ))}
                </div>
            </div>
        </>
    )
}
