import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
      type: String,
      required: true,
  },
  email: {
      type: String,
      required: true,
      unique: true,
  },
  password: {
      type: String,
      required: true,
  },
  friends: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
  }],
});

const User = mongoose.model('User', UserSchema);

module.exports = User;