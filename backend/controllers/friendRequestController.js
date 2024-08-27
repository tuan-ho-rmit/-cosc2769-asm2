import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";

export const createFriendRequest = async (req, res) => {
    try {
        const {
            fromId,
            toId,
            status,
        } = req.body;
        const newFriendRequest = new FriendRequest ({
            fromId,
            toId,
            status: "pending",
        })
        const savedFriendRequest = await newFriendRequest.save();
        res.status(200).json(savedFriendRequest);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Failed to create the friend rq: ', error: err.message});
    }
}

export const acceptFriendRequest = async (req, res) => {
    try {
        const {requestId} = req.params;
        const friendRequest = await FriendRequest.findOne({_id: requestId});

        if (!friendRequest) {
            return res.status(404).json({message: "Friend request not found"})
        }

        friendRequest.sttus = 'accepted';
        await friendRequest.save();

        const fromUser = await User.findByIdAndUpdate(
            friendRequest.fromId,
            {$push: {fromId: requestId}},
            {new: true}
        )
        const toUser = await User.findByIdAndUpdate(
            friendRequest.toId,
            {$push: {toId: requestId}},
            {new: true}
        )
        res.status(200).json({
            message: "Friend Request accepted",
            fromUser,
            toUser
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Failed to accept friend', error: err.message});
    }
    // step 1: findOne() frined request
    // step 2: modify status of friend reqeust to accepted
    // step 3: User.findByIdAndUpdate(fromId, req.body);
    // step 4: User.findByIdAndUpdate(toId, req.body);
    //
    // User.findByIdAndUpdate(fromId, {
    //   $push: { friendIds: toId }
    // }, { new: true });
    //
    // User.findByIdAndUpdate(toId, {
    //   $push: { friendIds: fromId }
    // }, { new: true });
    //
}

export const rejectFriendRequest = async (req, res) => {
    try {
        const {requestId} = req.params;
        const friendRequest = await friendRequest.findOne({_id: requestId});
        if (!friendRequest) {
            return res.status(404).json({message: "Friend rq not found"})
        }
        friendRequest.status = "rejected";
        await friendRequest.save();
        res.status(200).json({
            message: "Friend request rejected",
            friendRequest
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({message: 'Failed to reject friend', error: err.message});
    }
}

export const getAllFriendRequests = async (req, res) => {
    try {
        console.log('testing getall friend rq')
        const friendRequest = await FriendRequest.find();
        res.status(200).json(friendRequest);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'failed to fetch friend rq', error: err.message})
    }
}

export const getUserFriendsList = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).populate('friendIds');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "Successfully fetched user friends list",
            friendList: user.friendIds
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch user friends list', error: err.message });
    }
};
