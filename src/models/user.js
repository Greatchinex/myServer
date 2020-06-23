const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  password: String
});

module.exports = mongoose.model("User", UserSchema);
