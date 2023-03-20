require("dotenv").config();

const path = require("path");
const cors = require("cors");
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  optionSuccessStatus: 200,
};

const express = require("express");
const app = express();
const expressFileupload = require("express-fileupload");
app.use("/public", express.static(path.join(__dirname, "files")));
app.use(cors(corsOptions));
app.use(express.json());
app.use(expressFileupload());
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
app.use("/connect", require("./api/connect"));
app.use("/post", require("./api/post"));
app.use("/profile", require("./api/profile"));

httpServer.listen(8000);
