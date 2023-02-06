const { Server } = require("socket.io");

const io = new Server(8000, { cors: ["http://localhost:3000"] });

io.on("connection", (socket) => {
    console.log(socket);
});