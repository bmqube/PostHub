const express = require("express"); // module
const router = express.Router(); // module
const bcrypt = require("bcrypt");
const salt = 10;

const UserModel = require("../model/User");
const UserSession = require("../model/UserSession");
const Connections = require("../model/Connections");
const Post = require("../model/Post");

// router.get("/friends", async (req, res) => {
//   try {
//     let userId = req.headers.userid;

//     let data = [];

//     let friends1 = await Connections.find({
//       from: userId,
//       status: "accepted",
//     });

//     let friends2 = await Connections.find({
//       to: userId,
//       status: "accepted",
//     });

//     for (let i = 0; i < friends1.length; i++) {
//       const fren = friends1[i];

//       let
//     }

//     res.send({
//       code: "SUCCESS",
//     });
//   } catch (error) {
//     console.log(error);
//     res.send({
//       code: "FAIL",
//       message: "Something Went Wrong",
//     });
//   }
// });

module.exports = router;
