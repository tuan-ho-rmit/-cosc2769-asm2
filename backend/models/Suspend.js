import mongoose from 'mongoose';

const suspendSchema = new mongoose.Schema({
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userEmail: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Suspend = mongoose.model('Suspend', suspendSchema);

export default Suspend;
