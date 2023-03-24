const express = require("express"); // module
const router = express.Router(); // module

const UserModel = require("../model/User");
const UserSession = require("../model/UserSession");
const Connections = require("../model/Connections");

router.post("/send/:userId", async (req, res) => {
  try {
    let userId = req.headers.userid;
    let receiver = req.params.userId;

    // console.log(userId);

    let result1 = await Connections.find({
      from: receiver,
      to: userId,
      status: {
        $ne: "rejected",
      },
    });

    let result2 = await Connections.find({
      to: receiver,
      from: userId,
      status: {
        $ne: "rejected",
      },
    });

    if (result1.length === 0 && result2.length === 0) {
      let newConnection = new Connections({
        from: userId,
        to: receiver,
        status: "pending",
      });

      await newConnection.save();

      res.send({
        code: "SUCCESS",
        message: "Request successfully sent",
      });
    } else {
      res.send({
        code: "FAIL",
        message: "Already engaged",
      });
    }
  } catch (error) {
    console.log(error);
    res.send({
      code: "FAIL",
      message: "Something Went Wrong",
    });
  }
});

router.get("/suggestions", async (req, res) => {
  try {
    let userId = req.headers.userid;
    let users = await UserModel.find({
      _id: {
        $ne: userId,
      },
    });
    let data = [];

    for (let i = 0; i < users.length; i++) {
      const currUser = users[i];
      let result1 = await Connections.find({
        from: currUser._id,
        to: userId,
        status: {
          $ne: "rejected",
        },
      });

      let result2 = await Connections.find({
        to: currUser._id,
        from: userId,
        status: {
          $ne: "rejected",
        },
      });

      if (result1.length === 0 && result2.length === 0) {
        data.push({
          userId: currUser._id,
          name: currUser.name,
          email: currUser.email,
          dp: currUser.dp,
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

router.get("/requests", async (req, res) => {
  try {
    let userId = req.headers.userid;

    let data = [];
    let result = await Connections.find({
      to: userId,
      status: "pending",
    });

    for (let i = 0; i < result.length; i++) {
      const currUser = result[i];

      const userProfile = await UserModel.findById(currUser.from);

      data.push({
        userId: userProfile._id,
        name: userProfile.name,
        email: userProfile.email,
        dp: userProfile.dp,
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

router.get("/accept/:userId", async (req, res) => {
  try {
    let userId = req.headers.userid;
    let receiver = req.params.userId;

    let result = await Connections.findOne({
      from: receiver,
      to: userId,
      status: "pending",
    });

    console.log(result);

    result.status = "accepted";
    await result.save();

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

router.get("/friends", async (req, res) => {
  try {
    let userId = req.headers.userid;

    let data = [];
    let result1 = await Connections.find({
      to: userId,
      status: "accepted",
    });

    let result2 = await Connections.find({
      from: userId,
      status: "accepted",
    });

    let result = result1.concat(result2);

    for (let i = 0; i < result.length; i++) {
      const currUser = result[i];

      const userProfile = await UserModel.findById(currUser.from);

      data.push({
        userId: userProfile._id,
        name: userProfile.name,
        dp: userProfile.dp,
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

module.exports = router;
