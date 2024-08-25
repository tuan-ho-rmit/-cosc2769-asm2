import mongoose from 'mongoose';

const groupJoinRequestSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
  },
  groupName: {
    type: String,
    required: true,
  },
  requestedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
});

const GroupJoinRequest = mongoose.model('GroupJoinRequest', groupJoinRequestSchema);

export default GroupJoinRequest;
