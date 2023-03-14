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
    let postId = req.body.postid;

    let res = await PostReact.find({
      postId: postId,
      userId: userId,
    })
      .limit(1)
      .sort({ $natural: -1 });

    if (res.length) {
      res = res[0];
      res = 1 - res.existence;

      await res.save();
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
    let result = await Post.find({});

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
      let res = await PostReact.find({
        postId: post._id,
        userId: userId,
        existence: 1,
      });

      post.reacted = res.length > 0;
      post.createdBy = createdBy.name;
      data.push(post);

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
