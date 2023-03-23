const express = require("express");
const app = express();
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "OPTIONS"],
  },
});

io.on("connection", (socket) => {
  socket.on("setRoom", (userId) => {
    socket.join(userId);
  });
});

exports.io = io;
exports.server = httpServer;
exports.app = app;
