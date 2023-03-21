const express = require("express"); // module
const router = express.Router(); // module
const path = require("path");
const utils = require("../helpers/utils");

const UserModel = require("../model/User");
const UserSession = require("../model/UserSession");
const Connections = require("../model/Connections");
const Post = require("../model/Post");

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

      data.push({ userId: fren._id, name: fren.name, dp: fren.dp });
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
    console.log(req.body);
    let userId = req.headers.userid;
    let dp = req.files.dp;
    let dir = path.join(__dirname, "../files");

    let extension = dp.name.split(".").pop();
    let newFileName = `${utils.makeToken("DP")}.${extension}`;
    dp.mv(`${dir}/${newFileName}`);

    await UserModel.findByIdAndUpdate(userId, {
      dp: newFileName,
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
