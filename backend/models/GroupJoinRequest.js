import mongoose from 'mongoose';

const groupJoinRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
