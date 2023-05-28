import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { userRouter } from "./api/v1/routes/userRouter";
import mongoose from "mongoose";
import { dbConnection } from "./api/v1/db/db";
import http from "http";
import socketIO, { Server } from "socket.io";

//configure env variables
dotenv.config();

const app: Express = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

//middlewares
app.use(express.json());

app.use(
    cors({
        origin: "*",
    })
);

app.use("/api/v1/user", userRouter);

app.get("/", (req, res) => {
    res.send("Hello world");
});

const io = new Server(server);

// Handle Socket.IO connections
io.on("connection", (socket) => {
    console.log("New client connected");

    // Handle joining the group chat
    socket.on("joinGroupChat", ({ chatId }) => {
        socket.join(chatId); // Join the specified chat room (group chat)
        console.log(`User joined group chat: ${chatId}`);
    });

    // Handle joining the individual chat
    socket.on("joinDoctorChat", ({ chatId }) => {
        socket.join(chatId);
        console.log(`User joined doctor chat: ${chatId}`);
    });

    // Handle incoming individual chat messages
    socket.on("sendDoctorMessage", ({ chatId, message, userId, name }) => {
        console.log(message);

        // Emit the individual message to the recipient user only
        io.to(chatId).emit("newDoctorMessage", {
            userId,
            message,
            name
        });
    });

    // Handle incoming chat messages
    socket.on("sendGroupMessage", ({ chatId, message, userId, name }) => {
        console.log(message);
        // Broadcast the message to all clients in the chat room
        io.to(chatId).emit("newGroupMessage", {
            message,
            userId,
            name,
        });
    });

    // Handle disconnection
    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

server.listen(PORT, () => {
    console.log(`⚡️ [server]: Server is running at http://localhost:${PORT}`);
    dbConnection();
});
