const mongoose = require("mongoose");
const { Schema } = mongoose;

const Notification = new Schema({
  user: {
    type: String,
  },
  causedBy: {
    type: String,
  },
  notifyFor: {
    type: String,
    enum: ["comment", "reaction"],
  },
  reactedOn: {
    type: String,
    enum: ["post", "comment"],
    default: "post",
  },
  post: {
    type: String,
  },
  existence: {
    type: Number,
    default: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Notification ", Notification);
