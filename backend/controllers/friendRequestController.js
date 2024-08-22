import FriendRequest from '../models/FriendRequest';
import User from '../models/User';

// Send Friend Request
exports.sendFriendRequest = async (req, res) => {
    const { senderId, receiverId } = req.body;
    try {
      const existingRequest = await FriendRequest.findOne({
        where: { senderId, receiverId }
      });
  
      if (existingRequest) {
        return res.status(400).json({ message: 'Friend request already sent.' });
      }
  
      const friendRequest = await FriendRequest.create({ senderId, receiverId });
      res.status(201).json(friendRequest);
    } catch (error) {
      res.status(500).json({ error: 'Failed to send friend request.' });
    }
  };
  
  // Accept Friend Request
  exports.acceptFriendRequest = async (req, res) => {
    const { requestId } = req.params;
    try {
      const friendRequest = await FriendRequest.findByPk(requestId);
      if (!friendRequest) {
        return res.status(404).json({ message: 'Friend request not found.' });
      }
      friendRequest.status = 'accepted';
      await friendRequest.save();
      res.json(friendRequest);
    } catch (error) {
      res.status(500).json({ error: 'Failed to accept friend request.' });
    }
  };