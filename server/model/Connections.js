const mongoose = require("mongoose");
const { Schema } = mongoose;

const Connections = new Schema({
  from: {
    type: String,
  },
  to: {
    type: String,
  },
  status: {
    type: String,
    enum: ["pending", "rejected", "accepted"],
  },
});

module.exports = mongoose.model("Connections", Connections);
