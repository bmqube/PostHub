const express = require("express"); // module
const router = express.Router(); // module
const bcrypt = require("bcrypt");
const salt = 10;

const UserModel = require("../model/User");
const UserSession = require("../model/UserSession");
const Connections = require("../model/Connections");
const Post = require("../model/Post");
const PostReact = require("../model/PostReact");

router.post("/create", async (req, res) => {
  try {
    let userId = req.headers.userid;
    let message = req.body.message;
    let privacy = req.body.privacy;

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

router.post("/react", async (req, res) => {
  try {
    let userId = req.headers.userid;
    let postId = req.body.postId;

    // console.log(req.body);

    let result = await PostReact.findOne({
      postId: postId,
      userId: userId,
    });

    if (result) {
      result.existence = 1 - result.existence;

      await result.save();
    } else {
      let newReact = new PostReact({
        postId: postId,
        userId: userId,
      });

      await newReact.save();
    }

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
    let result = await Post.find({}).sort({ createdAt: -1 });

    let data = [];

    for (let i = 0; i < result.length; i++) {
      const post = result[i];

      if (post.privacy === "friends") {
        let res1 = await Connections.find({
          from: userId,
          to: post.creator,
          status: "accepted",
        });

        let res2 = await Connections.find({
          from: post.creator,
          to: userId,
          status: "accepted",
        });

        if (!res1.length && !res2.length) {
          continue;
        }
      }
      const createdBy = await UserModel.findById(post.creator);
      let reacted = await PostReact.find({
        postId: post._id.toString(),
        userId: userId,
        existence: 1,
      });

      let temp = {
        createdAt: post.createdAt,
        creator: post.creator,
        createdBy: createdBy.name,
        message: post.message,
        _id: post._id.toString(),
        reacted: reacted.length > 0,
        privacy: post.privacy,
      };
      data.push(temp);

      if (data.length === 10) {
        break;
      }
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

router.get("/feed/mine", async (req, res) => {
  try {
    let userId = req.headers.userid;
    let result = await Post.find({
      creator: userId,
    });

    let data = [];

    for (let i = 0; i < result.length; i++) {
      const post = result[i];
      let res = await PostReact.find({
        postId: post._id,
        userId: userId,
        existence: 1,
      });

      post.reacted = res.length > 0;
      data.push(post);
    }

    res.send({
      code: "SUCCESS",
      data: result,
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
