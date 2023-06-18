const express = require("express"); // module
const router = express.Router(); // module
const bcrypt = require("bcrypt");
const salt = 10;
const utils = require("../helpers/utils");

const UserModel = require("../model/User");
const UserSession = require("../model/UserSession");
const Connections = require("../model/Connections");
const Post = require("../model/Post");
const PostReact = require("../model/PostReact");

const server = require("../server.js");
const Message = require("../model/Message");
const path = require("path");
const UserGC = require("../model/UserGC");

router.get("/", async (req, res) => {
  try {
    let userId = req.headers.userid;

    let listOfMessages = await Message.aggregate([
      { $match: { $or: [{ from: userId }, { to: userId }] } },
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

      { $sort: { "lastMessage.createdAt": -1 } },

      { $limit: 10 },

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

router.get("/gc/:query", async (req, res) => {
  try {
    let userId = req.headers.userid;
    let query = req.params.query;

    let friends = await Connections.find({
      $or: [
        { from: userId, status: "accepted" },
        { to: userId, status: "accepted" },
      ],
    });

    // console.log(friends);
    let data = [];
    for (let i = 0; i < friends.length; i++) {
      const friend = friends[i];
      const frindModel = await UserModel.findById(
        friend.from === userId ? friend.to : friend.from
      );
      if (frindModel.name.includes(query) || frindModel.email.includes(query)) {
        data.push({
          userId: frindModel._id,
          email: frindModel.email,
          name: frindModel.name,
          dp: frindModel.dp,
        });
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

router.post("/gc/create", async (req, res) => {
  try {
    let userId = req.headers.userid;
    let selectedItems = req.body.selectedItems.map((item) => item.userId);
    let gcName = req.body.gcName;

    let newGCRelation = new UserGC({
      userId: [userId, ...selectedItems],
      gcName: gcName,
    });

    await newGCRelation.save();

    res.send({
      code: "SUCCESS",
      data: {},
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
      },
      null,
      {
        sort: { createdAt: -1 },
        skip: (page - 1) * limit,
        limit: limit,
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
        email: user.email,
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
    let type = req.body.type;
    let savedFileName = "";

    if (type !== "message") {
      let temp = req.files.message;
      // console.log(temp);
      let dir = path.join(__dirname, "../files");

      message = temp.name;
      let extension = message.split(".").pop().toLowerCase();

      // console.log(extension);

      if (["jpg", "jpeg", "png", "gif"].includes(extension)) {
        type = "image";
      } else if (["mp4", "avi", "mkv", "mov"].includes(extension)) {
        type = "video";
      } else if (["mp3", "wav", "m4a"].includes(extension)) {
        type = "audio";
      } else if (
        ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(extension)
      ) {
        type = "file";
      } else {
        res.send({
          code: "FAIL",
          message: "Invalid File Extension",
        });
        return;
      }

      savedFileName = `${utils.makeToken("Message")}.${extension}`;
      temp.mv(`${dir}/${savedFileName}`);
    }

    let newMessage = new Message({
      from: userId,
      to: to,
      message: message,
      status: "sent",
      type: type,
      savedFileName: savedFileName,
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
