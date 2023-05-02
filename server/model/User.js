const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  birthdate: Date,
  gender: { type: String, enum: ["male", "female", "others"] },
  dp: String,
  bio: String,
});

module.exports = mongoose.model("UserModel", UserSchema);
