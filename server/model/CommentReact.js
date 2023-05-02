const mongoose = require("mongoose");
const { Schema } = mongoose;

const CommentReact = new Schema({
  commentId: {
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

module.exports = mongoose.model("CommentReact", CommentReact);
