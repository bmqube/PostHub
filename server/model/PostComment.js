const mongoose = require("mongoose");
const { Schema } = mongoose;

const PostComment = new Schema({
  creator: {
    type: String,
  },
  message: {
    type: String,
  },
  postId: {
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

module.exports = mongoose.model("PostComment", PostComment);
