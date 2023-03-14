const express = require("express"); // module
const router = express.Router(); // module
const bcrypt = require("bcrypt");
const salt = 10;

const UserModel = require("../model/User");
const UserSession = require("../model/UserSession");
const Connections = require("../model/Connections");
const Post = require("../model/Post");

router.get("/friends/recent", async (req, res) => {
  try {
    let userId = req.headers.userid;

    let newPost = new Post({
      creator: userId,
      message: message,
      privacy: privacy,
    });

    await newPost.save();

    res.send({
      code: "SUCCESS",
    });
  } catch (error) {
    console.log(error);
    res.send({
      code: "FAIL",
      message: "Something Went Wrong",
    });
  }
});

module.exports = router;
