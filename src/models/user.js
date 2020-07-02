const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  password: String,
  // is_admin: {
  // 	type: Boolean,
  // 	default: false
  // }
});

module.exports = mongoose.model("User", UserSchema);