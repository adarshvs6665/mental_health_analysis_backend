import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { userRouter } from "./api/v1/routes/userRouter";
import { v4 as uuidv4 } from "uuid";
import { dbConnection } from "./api/v1/db/db";
import http from "http";
import socketIO, { Server } from "socket.io";
import { doctorRouter } from "./api/v1/routes/doctorRouter";
import Chat from "./api/v1/models/Chat";
import { tasksData } from "./api/v1/utils/data/tasksData";
import { formatDateAndSetToIST } from "./api/v1/utils/formatDate";

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
app.use("/api/v1/doctor", doctorRouter);

app.get("/",async (req, res) => {
  const date = new Date();
  const test = new Date("2023-06-10 11:38:51.785");
  const date1= await formatDateAndSetToIST(date)
  const date2 = await formatDateAndSetToIST(test)

  console.log(date1 === date2);
  
  res.json({ date1, date2 });
});

const io = new Server(server);

// Handle Socket.IO connections
io.on("connection", (socket) => {
  console.log("New client connected");

  // Handle joining the group chat
  socket.on("joinGroupChat", ({ chatId }) => {
    console.log(chatId);

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
    const newMessage = {
      message,
      userId,
      name,
    };

    Chat.findOneAndUpdate(
      { chatId: chatId }, // Filter condition
      { $push: { messages: newMessage } }, // Update operation
      { upsert: true } // Options: create a new document if it doesn't exist
    )
      .then(() => {
        console.log("Record updated or created successfully");
      })
      .catch((error) => {
        console.error("Error updating or creating record:", error);
      });

    // Emit the individual message to the recipient user only
    io.to(chatId).emit("newDoctorMessage", {
      userId,
      message,
      name,
    });
  });

  // Handle incoming chat messages
  socket.on("sendGroupMessage", ({ chatId, message, userId, name }) => {
    console.log(chatId);

    const newMessage = {
      message,
      userId,
      name,
    };

    console.log(newMessage);

    Chat.findOneAndUpdate(
      { chatId: chatId }, // Filter condition
      { $push: { messages: newMessage } }, // Update operation
      { upsert: true } // Options: create a new document if it doesn't exist
    )
      .then(() => {
        console.log("Record updated or created successfully");
      })
      .catch((error) => {
        console.error("Error updating or creating record:", error);
      });
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
