import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";

export const findFriendRequest = async (req, res) => {
    try {
        const {fromId, toId} = req.params;
        const existedRequest = await FriendRequest.findOne({fromId: fromId, toId: toId})

        return res.status(200).json(existedRequest || null);

    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Failed to  ', error: err.message});
    }
}

export const createFriendRequest = async (req, res) => {
    try {
        const {
            fromId,
            toId,
            status,
        } = req.body;
        console.log('from id: ', fromId)
        console.log('to id: ', toId)
        const existedRequest = await FriendRequest.findOne({fromId: fromId, toId: toId})
        if (!existedRequest) {
            const newFriendRequest = new FriendRequest ({
                fromId,
                toId,
                status: "pending",
            })
            const savedFriendRequest = await newFriendRequest.save();
            res.status(200).json(savedFriendRequest);
        } else {
            res.status(500).json({message: 'request already existed '});
        }
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

        friendRequest.status = 'accepted';
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
        const friendRequest = await FriendRequest.findOne({_id: requestId});
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

export const getUserFriendsList = async (req, res) => { // get friendslist on id
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).populate('friendIds');

        console.log(user)

        if (!user) { // TODO: cannot define the user
            return res.status(404).json({ message: "User not found" });
        }
        // return the populated friendids
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch user friends list', error: err.message });
    }
};

export const getPendingFriendRequests = async (req, res) => {
    try {
        const userId = req.params.id; // Get the user ID from the route parameter
        const pendingRequests = await FriendRequest.find({
            toId: userId,
            status: 'pending'
        }).populate('fromId'); // Populate fromId to get user details

        if (!pendingRequests) {
            return res.status(404).json({ message: "No pending friend requests found" });
        }

        res.status(200).json({
            message: "Successfully fetched pending friend requests",
            pendingRequests
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch pending friend requests', error: err.message });
    }
};
