const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: String, // String is shorthand for {type: String}
  email: {
    type: String,
    unique: true,
  },
  password: String,
  birthdate: Date,
  gender: String,
  dp: String,
});

module.exports = mongoose.model("UserModel", UserSchema);
