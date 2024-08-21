import FriendRequest from "../models/FriendRequest";
import User from "../models/User";

// Send a friend request
exports.sendFriendRequest = async (req, res) => {
    const { receiverId } = req.body;
    const senderId = req.user.id;

    try {
        // Check if a request already exists
        const existingRequest = await FriendRequest.findOne({
            sender: senderId,
            receiver: receiverId,
        });

        if (existingRequest) {
            return res.status(400).json({ msg: 'Friend request already sent' });
        }

        const friendRequest = new FriendRequest({
            sender: senderId,
            receiver: receiverId,
        });

        await friendRequest.save();
        res.json(friendRequest);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Accept a friend request
exports.acceptFriendRequest = async (req, res) => {
    const requestId = req.params.requestId;

    try {
        const friendRequest = await FriendRequest.findById(requestId);

        if (!friendRequest || friendRequest.receiver.toString() !== req.user.id) {
            return res.status(404).json({ msg: 'Friend request not found' });
        }

        friendRequest.status = 'Accepted';
        await friendRequest.save();

        // Add friends to both users' friend lists
        await User.findByIdAndUpdate(friendRequest.sender, {
            $push: { friends: friendRequest.receiver },
        });
        await User.findByIdAndUpdate(friendRequest.receiver, {
            $push: { friends: friendRequest.sender },
        });

        res.json(friendRequest);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Reject a friend request
exports.rejectFriendRequest = async (req, res) => {
    const requestId = req.params.requestId;

    try {
        const friendRequest = await FriendRequest.findById(requestId);

        if (!friendRequest || friendRequest.receiver.toString() !== req.user.id) {
            return res.status(404).json({ msg: 'Friend request not found' });
        }

        friendRequest.status = 'Rejected';
        await friendRequest.save();

        res.json(friendRequest);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get all friend requests for a user
exports.getFriendRequests = async (req, res) => {
    try {
        const friendRequests = await FriendRequest.find({
            receiver: req.user.id,
            status: 'Pending',
        }).populate('sender', 'name email');

        res.json(friendRequests);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};