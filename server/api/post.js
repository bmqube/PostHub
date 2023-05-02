const express = require("express"); // module
const router = express.Router(); // module
const bcrypt = require("bcrypt");
const salt = 10;

const UserModel = require("../model/User");
const UserSession = require("../model/UserSession");
const Connections = require("../model/Connections");
const Post = require("../model/Post");
const PostReact = require("../model/PostReact");

const server = require("../server.js");
const PostComment = require("../model/PostComment");
const Notification = require("../model/Notification");
const CommentReaction = require("../model/CommentReact");
const CommentReact = require("../model/CommentReact");

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
  // console.log(server.io);
  try {
    let userId = req.headers.userid;
    let postId = req.body.postId;

    // console.log(req.body);

    let result = await PostReact.findOne({
      postId: postId,
      userId: userId,
    });

    let post = await Post.findById(postId);

    if (post.creator !== userId) {
      let notification = new Notification({
        user: post.creator,
        causedBy: userId,
        post: postId,
        notifyFor: "reaction",
      });

      await notification.save();
      server.io.to(post.creator).emit("notification", "reaction");
    }

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

router.post("/comment/react", async (req, res) => {
  // console.log(server.io);
  try {
    let userId = req.headers.userid;
    let commentId = req.body.commentId;

    // console.log(req.body);

    let result = await CommentReact.findOne({
      commentId: commentId,
      userId: userId,
    });

    let comment = await PostComment.findById(commentId);

    if (comment.creator !== userId) {
      let notification = new Notification({
        user: comment.creator,
        causedBy: userId,
        post: comment.postId,
        notifyFor: "reaction",
        reactedOn: "comment",
      });

      await notification.save();
      server.io.to(comment.creator).emit("notification", "reaction");
    }

    if (result) {
      result.existence = 1 - result.existence;

      await result.save();
    } else {
      let newReact = new CommentReact({
        commentId: commentId,
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

router.get("/feed/:id", async (req, res) => {
  try {
    let userId = req.headers.userid;
    let id = req.params.id;
    if (id === "mine") {
      id = userId;
    }
    let result = await Post.find({
      creator: id,
    });

    let data = [];
    let profile = await UserModel.findById(id, {
      password: 0,
    });

    for (let i = 0; i < result.length; i++) {
      const post = result[i].toJSON();
      let res = await PostReact.find({
        postId: post._id,
        userId: userId,
        existence: 1,
      });

      post.reacted = res.length > 0;
      post.createdBy = profile.name;
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

router.post("/comment", async (req, res) => {
  try {
    let userId = req.headers.userid;
    let comment = req.body.comment;
    let postId = req.body.postId;

    let newComment = new PostComment({
      creator: userId,
      message: comment,
      postId: postId,
    });

    await newComment.save();

    let post = await Post.findById(postId);

    if (post.creator !== userId) {
      let notification = new Notification({
        user: post.creator,
        causedBy: userId,
        post: postId,
        notifyFor: "comment",
      });

      await notification.save();
      server.io.to(post.creator).emit("notification", "reaction");
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

router.get("/details/:postId", async (req, res) => {
  try {
    let postId = req.params.postId;
    let userId = req.headers.userid;

    let post = await Post.findById(postId);
    let postCreator = await UserModel.findById(post.creator);
    post = post.toJSON();
    post.createdBy = postCreator.name;
    let comments_temp = await PostComment.find({
      postId: postId,
    });
    let comments = [];

    for (let i = 0; i < comments_temp.length; i++) {
      const curr_comment = comments_temp[i].toJSON();
      let user = await UserModel.findById(curr_comment.creator);
      curr_comment.creatorName = user.name;
      curr_comment.dp = user.dp;

      let temp = await CommentReact.find({
        commentId: curr_comment._id,
        userId: userId,
        existence: 1,
      });

      curr_comment.reacted = temp.length > 0;

      comments.push(curr_comment);
    }

    res.send({
      code: "SUCCESS",
      data: {
        post: post,
        comments: comments,
      },
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
