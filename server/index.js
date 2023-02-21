require("dotenv").config();
const cors = require("cors");
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  optionSuccessStatus: 200,
};

const express = require("express");
const app = express();
app.use(cors(corsOptions));
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer);

app.use(express.json({ limit: "500mb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "500mb",
  })
);
require("./db");

io.on("connection", (socket) => {
  console.log(socket);
});

app.use("/auth", require("./api/auth"));

httpServer.listen(8000);
