const express = require("express"); // module
const router = express.Router(); // module
const path = require("path");
const utils = require("../helpers/utils");

const UserModel = require("../model/User");
const UserSession = require("../model/UserSession");
const Connections = require("../model/Connections");
const Post = require("../model/Post");

const fs = require("fs");

const sharp = require("sharp");

router.get("/friends", async (req, res) => {
  try {
    let userId = req.headers.userid;

    let data = [];

    let friends1 = await Connections.find({
      from: userId,
      status: "accepted",
    });

    let friends2 = await Connections.find({
      to: userId,
      status: "accepted",
    });

    for (let i = 0; i < friends1.length; i++) {
      const curr_id = friends1[i];

      const fren = await UserModel.findById(curr_id.to);

      data.push({ userId: fren._id, name: fren.name, dp: fren.dp });
    }

    for (let i = 0; i < friends2.length; i++) {
      const curr_id = friends2[i];

      //   console.log();

      const fren = await UserModel.findById(curr_id.from);

      data.push({
        userId: fren._id,
        name: fren.name,
        email: fren.email,
        dp: fren.dp,
      });
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

router.post("/update/dp", async (req, res) => {
  try {
    // console.log(req.body);
    let userId = req.headers.userid;
    let dp = req.files.dp;
    let dir = path.join(__dirname, "../files");

    let extension = dp.name.split(".").pop();
    let newFileName = `${utils.makeToken("DP")}.${extension}`;
    let newFileName2 = `${utils.makeToken("DP")}.${extension}`;
    await dp.mv(`${dir}/${newFileName}`);

    const { height, width } = await sharp(`./files/${newFileName}`).metadata();

    const size = Math.max(width, height);
    await sharp(`./files/${newFileName}`)
      .resize(size)
      .extend({
        left: Math.max(Math.floor((size - width) / 2), 0),
        right: Math.max(Math.floor((size - width) / 2), 0),
        top: Math.max(Math.floor((size - height) / 2), 0),
        bottom: Math.max(Math.floor((size - height) / 2), 0),
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .toFile(`./files/${newFileName2}`);

    fs.unlink(`./files/${newFileName}`, (err) => {
      if (err) {
        console.log(err);
      }
    });

    await UserModel.findByIdAndUpdate(userId, {
      dp: newFileName2,
    });

    res.send({
      code: "SUCCESS",
      message: "Profile picture updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.send({
      code: "FAIL",
      message: "Something Went Wrong",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    let profileId = req.params.id;
    let userId = req.headers.userid;

    if (profileId === "my") {
      profileId = userId;
    }

    let profile = await UserModel.findById(profileId, {
      password: 0,
    });

    profile = profile.toJSON();

    if (profile && profileId !== userId) {
      let connection = await Connections.findOne({
        $or: [
          { from: userId, to: profileId },
          { from: profileId, to: userId },
        ],
      });

      if (connection) {
        // console.log(connection);
        profile.status = connection.status;

        if (connection.status === "pending" && connection.to === userId) {
          profile.status = "confirm";
        }
      }
    }

    res.send({
      code: "SUCCESS",
      data: profile,
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
