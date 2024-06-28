import React from 'react'
import { Avatar } from '@mui/material'
export default function Message({ me, value,email }) {
    return (
        <div className={`message ${me && 'me'}`}>
            <Avatar alt="Remy Sharp" src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${email}`} />
            <div className="text">{value}</div>
        </div>
    )
}
