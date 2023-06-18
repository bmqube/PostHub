const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserGC = new Schema({
  userId: {
    type: [String],
  },
  gcName: {
    type: String,
  },
});

module.exports = mongoose.model("UserGC", UserGC);
