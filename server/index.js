const { server, app } = require("./server");
require("dotenv").config();
const express = require("express");
const path = require("path");

const cors = require("cors");
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  optionSuccessStatus: 200,
};
const expressFileupload = require("express-fileupload");
app.use("/public", express.static(path.join(__dirname, "files")));
app.use(cors(corsOptions));
app.use(express.json());
app.use(expressFileupload());
app.use(express.json({ limit: "500mb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "500mb",
  })
);

require("./db");

app.use("/auth", require("./api/auth"));
app.use("/connect", require("./api/connect"));
app.use("/post", require("./api/post"));
app.use("/profile", require("./api/profile"));
app.use("/messages", require("./api/messages"));

// app.get("/", async (req, res) => {

//   res.send({
//     code: "SUCCESS",
//   });
// });

server.listen(8000);
