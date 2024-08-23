import FriendRequest from '../models/FriendRequest';

// Send a Friend Request
exports.sendFriendRequest = async (req, res) => {
  const { senderId, receiverId } = req.body;

  try {
    // Check if a friend request already exists
    const existingRequest = await FriendRequest.findOne({
      where: { senderId, receiverId }
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'Friend request already sent.' });
    }

    // Create a new friend request
    const friendRequest = await FriendRequest.create({ senderId, receiverId });
    res.status(201).json({ message: 'Friend request sent.', friendRequest });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send friend request.' });
  }
};

// Accept a Friend Request
exports.acceptFriendRequest = async (req, res) => {
  const { requestId } = req.params;

  try {
    const friendRequest = await FriendRequest.findByPk(requestId);

    if (!friendRequest) {
      return res.status(404).json({ message: 'Friend request not found.' });
    }

    friendRequest.status = 'Accepted';
    await friendRequest.save();

    // Here you can create a friendship relationship between the two users
    // For example, insert them into a Friends table.

    res.json({ message: 'Friend request accepted.', friendRequest });
  } catch (error) {
    res.status(500).json({ error: 'Failed to accept friend request.' });
  }
};

// Reject a Friend Request
exports.rejectFriendRequest = async (req, res) => {
  const { requestId } = req.params;

  try {
    const friendRequest = await FriendRequest.findByPk(requestId);

    if (!friendRequest) {
      return res.status(404).json({ message: 'Friend request not found.' });
    }

    friendRequest.status = 'Rejected';
    await friendRequest.save();

    res.json({ message: 'Friend request rejected.', friendRequest });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reject friend request.' });
  }
};