import users, { connections } from "../db.js";


export const socketHandler=(io)=>{
    io.on('connection', (socket) => {
        const { id } = socket.handshake.query;
        console.log("Connection started", socket.id);
    
        // Find the user by id from the users array
        const user = users.find(user => user.id == id);
    
        // Find the index of the user's connection in the connections array
        let connectionIndex = connections.findIndex(connection => connection.uid == user.id);
    
        if (connectionIndex === -1) {
            // If the connection doesn't exist, add it to the connections array
            connections.push({ uid: user.id, sid: socket.id });
            connectionIndex = connections.length - 1;
        } else {
            // If the connection exists, update the socket id
            connections[connectionIndex].sid = socket.id;
        }
    
        // Notify all clients to refresh except the connected user
        io.emit('refreshAllExcept', id);
    
        socket.on('refreshBuddy', (data) => {
            const connection = connections.find(connection => connection.uid == data.id);
            if (connection) {
                io.to(connection.sid).emit('refresh', 0);
            }
        });
    
        socket.on('outgoing_message', (data) => {
            const connection = connections.find(connection => connection.uid == data.id);
            if (connection) {
                io.to(connection.sid).emit('incoming_message', data.message);
            }
            console.log('message:', data.message);
        });
    
        socket.on('disconnect', () => {
            console.log('user disconnected', connectionIndex);
            if (connectionIndex !== -1) {
                console.log(connections);
                connections.splice(connectionIndex, 1);
                console.log(connections);
    
                const user = users.find(user => user.id == id);
                if (user) {
                    user.inchat = 0;
                }
    
                io.emit('refresh', 0);
            }
        });
    });
}