const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserDetails = new Schema({
  userId: {
    type: String,
  },
  type: {
    type: String,
    enum: ["education", "work", "place"],
  },
  name: {
    type: String,
  },
  position: {
    type: String,
  },
  location: {
    type: String,
  },
  start: {
    type: Date,
  },
  end: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("UserDetails", UserDetails);
