import React from 'react'
import { Avatar } from '@mui/material'
export default function Message({ me, value,email }) {
    const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
    return (
        <div className={`message ${me && 'me'}`}>
            <Avatar alt="Remy Sharp" src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${email}`} />
            {urlPattern.test(value)?(<img style={{border:'2px solid violet',borderRadius:'10px',backgroundColor:'white',maxWidth:"80%",objectFit:"cover"}} src={value} alt='img'/>):(<div className="text">{value}</div>)}
        </div>
    )
}
