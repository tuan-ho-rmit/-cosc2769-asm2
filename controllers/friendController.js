import User from '../models/User'

// Accept a friend request
exports.acceptFriendRequest = async (req, res) => {
    const { senderId } = req.body;
    const userId = req.user.id;

    try {
        // Find the users
        const user = await User.findById(userId);
        const sender = await User.findById(senderId);

        if (!user || !sender) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Check if there's a pending friend request from the sender
        const pendingRequest = user.friendRequests.find(
            (request) => request.toString() === senderId
        );

        if (!pendingRequest) {
            return res.status(400).json({ msg: 'No pending friend request from this user' });
        }

        // Add each user to the other's friends list
        user.friends.push(senderId);
        sender.friends.push(userId);

        // Remove the friend request
        user.friendRequests = user.friendRequests.filter(
            (request) => request.toString() !== senderId
        );

        // Save the users
        await user.save();
        await sender.save();

        res.json({ msg: 'Friend request accepted', friends: user.friends });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};