const mongoose = require("mongoose");

const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: "First name is required!" },
  lastName: { type: String, required: "Last name is required!" },
  email: { type: String, required: "Email address is required!" },
  password: { type: String/* , required: ["Password is required!"]  */},
  roleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
  },
  wishlist: [String],
  avatar: String,
  dob: Date,
  bio: String,
  active: {
    type: Boolean,
    default: false,
  },
  otp: {
    type: String,
    required: true,
  },
})

UserSchema.virtual("role", {
  ref: 'Role',
  localField: 'roleId',
  foreignField: '_id',
  justOne: true
})

UserSchema.plugin(passportLocalMongoose, { usernameField: "email", usernameUnique: true })
const User = mongoose.model('User', UserSchema);

module.exports = User;
