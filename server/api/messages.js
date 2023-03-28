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
const Message = require("../model/Message");

router.get("/", async (req, res) => {
  try {
    let userId = req.headers.userid;

    let listOfMessages = await Message.aggregate([
      // Match messages sent or received by the specified user
      { $match: { $or: [{ from: userId }, { to: userId }] } },

      // Group messages by sender and receiver
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$from", userId] },
              then: "$to",
              else: "$from",
            },
          },
          lastMessage: { $last: "$$ROOT" },
        },
      },

      // Sort by the timestamp of the last message for each user
      { $sort: { "lastMessage.createdAt": -1 } },

      // Limit to the last 10 unique people
      { $limit: 10 },

      // Project the desired fields for each result
      {
        $project: {
          _id: 0,
          user: "$_id",
          message: "$lastMessage.message",
          // status: "$lastMessage.status",
          createdAt: "$lastMessage.createdAt",
        },
      },
    ]);

    // console.log(listOfMessages);

    for (let i = 0; i < listOfMessages.length; i++) {
      let message = listOfMessages[i];
      let curr_user = await UserModel.findById(message.user);

      message.username = curr_user.name;
      message.dp = curr_user.dp;
    }

    res.send({
      code: "SUCCESS",
      data: listOfMessages,
    });
  } catch (error) {
    console.log(error);
    res.send({
      code: "FAIL",
      message: "Something Went Wrong",
    });
  }
});

router.get("/:userid/:page", async (req, res) => {
  try {
    let userId = req.headers.userid;
    let anotherUser = req.params.userid;
    let page = req.params.page;

    let limit = 10;

    let user = await UserModel.findById(anotherUser);

    // console.log(user);

    let listOfMessages = await Message.find(
      {
        $or: [
          { from: userId, to: anotherUser },
          { from: anotherUser, to: userId },
        ],
      }, // filter for messages between the two users
      null, // retrieve all fields
      {
        sort: { createdAt: -1 }, // sort by createdAt in descending order
        skip: (page - 1) * limit, // skip to the appropriate page
        limit: limit, // retrieve the specified number of messages per page
      }
    );

    // await Message.updateMany(
    //   {
    //     $or: [
    //       { from: userId, to: anotherUser },
    //       { from: anotherUser, to: userId },
    //     ],
    //     status: "sent",
    //   }, // filter for messages between the two users
    //   { $set: { status: "seen" } }
    // );

    let data = {
      user: {
        id: user._id,
        name: user.name,
        dp: user.dp,
      },
      messages: listOfMessages,
    };

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

router.post("/send", async (req, res) => {
  //   console.log("heda");
  try {
    let userId = req.headers.userid;
    let message = req.body.message;
    let to = req.body.to;

    let newMessage = new Message({
      from: userId,
      to: to,
      message: message,
      status: "sent",
      type: "message",
    });

    await newMessage.save();

    server.io.to(to).emit("message", newMessage);

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
