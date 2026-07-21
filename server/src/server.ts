import "dotenv/config";
import app from "./app";
import { connectDB } from "./config/database";
import listEndpoints from "express-list-endpoints";
import { createServer } from "http";
import { Server } from "socket.io";

const PORT = process.env.PORT || 8000;

const httpServer = createServer(app);

export const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("✅ Socket Connected:", socket.id);

  socket.on("join", (userId: string) => {
    socket.join(userId);
    console.log(`${socket.id} joined room ${userId}`);
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket Disconnected:", socket.id);
  });
});

const startServer = async () => {
  await connectDB();

  httpServer.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`🚀 Verity Server running on port ${PORT}`);
  });
};

console.log(listEndpoints(app));

startServer();

