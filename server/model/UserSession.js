const mongoose = require("mongoose");

const userSession = new mongoose.Schema({
  userId: {
    type: String,
  },
  status: {
    type: String,
    default: "Active",
  },
  existence: {
    type: Number,
    default: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
  },
});

module.exports = mongoose.model("UserSession", userSession);
