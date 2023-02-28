const express = require("express"); // module
const router = express.Router(); // module
const bcrypt = require("bcrypt");
const salt = 10;

const UserModel = require("../model/User");
const UserSession = require("../model/UserSession");
const Connections = require("../model/Connections");
const Post = require("../model/Post");

router.post("/create", async (req, res) => {
  try {
    let userId = req.headers.userid;
    let message = req.body.message;

    let newPost = new Post({
      creator: userId,
      message: message,
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

router.get("/feed", async (req, res) => {
  try {
    let userId = req.headers.userid;
    let result = await Post.aggregate([{ $sample: { size: 10 } }]);

    let data = [];

    for (let i = 0; i < result.length; i++) {
      const post = result[i];
      const createdBy = await UserModel.findById(post.creator);
      post.createdBy = createdBy.name;
      data.push(post);
    }

    res.send({
      code: "SUCCESS",
      data: data,
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
