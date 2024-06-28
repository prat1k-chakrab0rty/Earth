import express from "express";
import { createServer } from 'node:http';
import authRoute from "./routes/auth.js";
import userRoute from "./routes/user.js";
import cookieParser from "cookie-parser";
import { Server } from 'socket.io';
import cors from "cors";
import 'dotenv/config';
import users, { connections } from "./db.js";

const app = express();

const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST", "OPTIONS"]
    }
});

app.use(express.json());

app.use(cookieParser());

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);

io.on('connection', (socket) => {
    const { id } = socket.handshake.query;
    const u = users.find(user => user.id == id);
    const index = connections.findIndex(connection => connection.uid == u.id);
    if (index == -1)
        connections.push({ uid: u.id, sid: socket.id });
    else
        connections[index].sid = socket.id;
    io.emit('refresh', "hola");
    socket.on('logout', (data) => {
        io.emit('refresh', "hola");
    });
    socket.on('refreshBuddy', (data) => {
        const connection = connections.find(connection => connection.uid == data.id);
        if (connection)
            io.to(connection.sid).emit('refresh', "hola");
    });
    socket.on('outgoing_message', (data) => {
        const connection = connections.find(connection => connection.uid == data.id);
        if (connection)
            io.to(connection.sid).emit('incoming_message', data.message);
        console.log('message: ' + data.message);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
        if (index != -1) {
            connections.splice(index, 1);
            const u = users.find(user => user.id == id);
            if (u)
                u.inchat = 0;
            io.emit('refresh', "hola");
        }
    });
});

//error handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong";
    res.status(statusCode).json({ data: null, message });
});

server.listen(process.env.PORT, () => {
    console.log(`Backend is active on port number ${process.env.PORT}!`);
});