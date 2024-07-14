const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  accountId: {
    type: String,
  },
  profile: {
    type: String,
    required: [true, "Profile is Required"],
  },
  firstName: {
    type: String,
    required: [true, "First Name is Required"],
  },
  lastName: {
    type: String,
    required: [true, "Last Name is Required"],
  },
  email: {
    type: String,
    required: [true, "Email is Required"],
  },
  password: {
    type: String,
  },
  provider: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  mobileNo: {
    type: String,
  },
});

module.exports = mongoose.model("User", userSchema);
