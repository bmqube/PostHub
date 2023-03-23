const mongoose = require("mongoose");
const { Schema } = mongoose;

const Message = new Schema({
  from: {
    type: String,
  },
  to: {
    type: String,
  },
  message: {
    type: String,
  },
  status: {
    type: String,
    enum: ["sent", "seen"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Message", Message);
