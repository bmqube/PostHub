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

router.get("/", async (req, res) => {
  try {
    let userId = req.headers.userid;

    let notifications = await Notification.find({ user: userId });
    let data = [];

    for (let i = 0; i < notifications.length; i++) {
      const curr_notification = notifications[i].toJSON();
      let user = await UserModel.findById(curr_notification.causedBy, {
        name: 1,
        dp: 1,
      });
      curr_notification.causedBy = user;
      data.push(curr_notification);
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
