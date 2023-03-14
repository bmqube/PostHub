const mongoose = require("mongoose");
const { Schema } = mongoose;

const Post = new Schema({
  creator: {
    type: String,
  },
  message: {
    type: String,
  },
  status: {
    type: String,
    default: "Active",
  },
  privacy: {
    type: String,
    enum: ["public", "friends", "me"],
    default: "public",
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

module.exports = mongoose.model("Post", Post);
