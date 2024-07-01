import express from "express";
import { createServer } from 'node:http';
import authRoute from "./routes/auth.js";
import userRoute from "./routes/user.js";
import cookieParser from "cookie-parser";
import { Server } from 'socket.io';
import cors from "cors";
import 'dotenv/config';
import { socketHandler } from "./socket/handler.js";

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

socketHandler(io);


//error handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong";
    res.status(statusCode).json({ data: null, message });
});

server.listen(process.env.PORT, () => {
    console.log(`Backend is active on port number ${process.env.PORT}!`);
});