import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  avatar: {
    type: String, // Base64 encoded image
    required: true,
  },
  status: {
    type: String,
    default: 'pending',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Group = mongoose.model('Group', groupSchema);

export default Group;
