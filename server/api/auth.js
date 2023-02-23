const express = require("express"); // module
const router = express.Router(); // module
const bcrypt = require("bcrypt");
const salt = 10;

const UserModel = require("../model/User");
const UserSession = require("../model/UserSession");

router.post("/login", async (req, res) => {
  try {
    let email = req.body.email;
    let password = req.body.password;

    let currentUser = await UserModel.findOne({
      email: email,
    });

    let status = await bcrypt.compare(password, currentUser.password);

    if (status) {
      let currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + 30);

      let newUserSession = new UserSession({
        userId: currentUser._id,
        expiresAt: currentDate,
      });

      await newUserSession.save();

      res.send({
        code: "SUCCESS",
        message: "Login is successful",
        data: {
          userId: currentUser._id,
          name: currentUser.name,
          userSessionId: newUserSession._id,
        },
      });
    } else {
      res.send({
        code: "FAIL",
        message: "Password did not match",
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

router.post("/register", async (req, res) => {
  try {
    let fullname = req.body.fullname;
    let birthdate = new Date(req.body.birthdate);
    let gender = req.body.gender;
    let email = req.body.email;
    let password = await bcrypt.hash(req.body.password, salt);

    let newUser = new UserModel({
      name: fullname,
      birthdate: birthdate,
      gender: gender,
      email: email,
      password: password,
    });

    await newUser.save();

    res.send({
      code: "SUCCESS",
      message: "Registration is successful",
    });
  } catch (error) {
    // console.log(error.message);
    res.send({
      code: "FAIL",
      message: "Something Went Wrong",
    });
  }
});

module.exports = router;
