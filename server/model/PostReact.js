const mongoose = require("mongoose");
const { Schema } = mongoose;

const PostReact = new Schema({
  postId: {
    type: String,
  },
  userId: {
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

module.exports = mongoose.model("PostReact", PostReact);
