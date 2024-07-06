import React, { useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import { AppBar, Avatar, Button, Dialog, Divider, IconButton, List, ListItemButton, ListItemText, Toolbar, Typography } from '@mui/material'
export default function Message({ me, value, email }) {
    const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
    const [isClicked, setIsClicked] = useState(false);

    const handleImageClick = () => {
        setIsClicked(true);
    }

    const handleClose = () => {
        setIsClicked(false);
    }

    return (<>
        <div className={`message ${me && 'me'}`}>
            <Avatar alt="Remy Sharp" src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${email}`} />
            {urlPattern.test(value) ? (<img onClick={handleImageClick} className='cp' style={{ border: '2px solid violet', borderRadius: '10px', backgroundColor: 'white', width: "10%", objectFit: "cover" }} src={value} alt='img' />) : (<div className="text">{value}</div>)}
        </div>
        {/* view image dialog */}
        <Dialog
            fullScreen
            open={isClicked}
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
                        Image Viewer
                    </Typography>
                </Toolbar>
            </AppBar>
            <img style={{ maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain", border: '2px solid violet', margin: 'auto' }} src={value} alt='image' />
        </Dialog>
    </>
    )
}
