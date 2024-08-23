import User from "../models/User.js";

// Get friend requests
exports.getFriendRequests = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('friendRequests', 'name');
        res.json(user.friendRequests.map(request => ({
            senderId: request._id,
            senderName: request.name
        })));
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
