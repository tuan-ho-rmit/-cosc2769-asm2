import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";
import {createNoti} from "./notiController.js";

export const findFriendRequest = async (req, res) => {
    try {
        const {firstId, secondId} = req.params;
        const existedRequest1 = await FriendRequest.findOne({fromId: firstId, toId: secondId})
        const existedRequest2 = await FriendRequest.findOne({fromId: secondId, toId: firstId})

        return res.status(200).json(existedRequest1 || existedRequest2 || null);

    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Failed to find friend request: ', error: err.message});
    }
}

export const createFriendRequest = async (req, res) => {
    try {
        // const {firstId, secondId} = req.body; // extract data from body
        const {
            fromId,
            toId,
            status,
        } = req.body;
        console.log('from id: ', fromId)
        console.log('to id: ', toId)
        const existedRequest1 = await FriendRequest.findOne({fromId: fromId, toId: toId})
        const existedRequest2 = await FriendRequest.findOne({fromId: toId, toId: fromId})
        if (!existedRequest1 && !existedRequest2) {
            const newFriendRequest = new FriendRequest ({
                fromId,
                toId,
                status: "pending",
            })
            const savedFriendRequest = await newFriendRequest.save();

            // create notification
            createNoti([toId])

            res.status(200).json(savedFriendRequest);
        } else {
            res.status(500).json({message: 'request already existed '});
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Failed to create the friend rq: ', error: err.message});
    }
}

// function to change status to accept friend request, and update friend list
export const acceptFriendRequest = async (req, res) => {
    try {
        const {requestId} = req.params;
        const friendRequest = await FriendRequest.findOne({_id: requestId});

        if (!friendRequest) {
            return res.status(404).json({message: "Friend request not found"})
        }

        friendRequest.status = 'accepted';
        await friendRequest.save();

        // Add the 'toId' to the 'fromId' user's friend list
        const fromUser = await User.findByIdAndUpdate(
            friendRequest.fromId,
            { $addToSet: { friendIds: friendRequest.toId } }, // Add receiver ID to sender's friend list
            { new: true }
        );

        // Add the 'fromId' to the 'toId' user's friend list
        const toUser = await User.findByIdAndUpdate(
            friendRequest.toId,
            { $addToSet: { friendIds: friendRequest.fromId } }, // Add sender ID to receiver's friend list
            { new: true }
        );


        res.status(200).json({
            message: "Friend Request accepted",
            fromUser,
            toUser
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Failed to accept friend', error: err.message});
    }
}

// function to only change status to reject for existing friend requests
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

// Function to delete a friend request permanently
export const deleteFriendRequest = async (req, res) => {
    try {
        const { requestId } = req.params;

        // find the friend request by ID
        const friendRequest = await FriendRequest.findOne({ _id: requestId });

        if (!friendRequest) {
            return res.status(404).json({ message: "Friend request not found" });
        }

        // Delete the friend request
        await FriendRequest.deleteOne({ _id: requestId });

        //Send a success response
        res.status(200).json({
            message: "Friend request deleted successfully",
            friendRequest
        });
    } catch (err) {
        console.error('Error deleting friend request:', err.message);
        res.status(500).json({ message: 'Failed to delete friend request', error: err.message });
    }
};

// function to get friendslist
export const getUserFriendsList = async (req, res) => { // get friendslist on id
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).populate('friendIds');

        console.log(user)

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // return the populated friendids
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch user friends list', error: err.message });
    }
};

// function to unfriend.
export const unfriend = async (req, res) => {
    try {
        const { requestId } = req.params;

        // Find the friend request by ID
        const friendRequest = await FriendRequest.findById(requestId);
        if (!friendRequest) {
            return res.status(404).json({ message: "Friend request not found" });
        }


        // Remove the friend request
        await FriendRequest.deleteOne({ _id: requestId });

        // // Update the friend request status to 'rejected'
        // friendRequest.status = 'rejected';
        // await friendRequest.save();


        // Remove each user's ID from the other's friendIds array
        const { fromId, toId } = friendRequest;

        // Update the 'fromId' user's friend list
        await User.findByIdAndUpdate(
            fromId,
            { $pull: { friendIds: toId } }, // Remove 'toId' from 'fromId' user's friend list
            { new: true }
        );

        // Update the 'toId' user's friend list
        await User.findByIdAndUpdate(
            toId,
            { $pull: { friendIds: fromId } }, // Remove 'fromId' from 'toId' user's friend list
            { new: true }
        );

        res.status(200).json({
            message: "Users have been unfriended",
            friendRequest
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to unfriend', error: err.message });
    }
}


// function to get all friend requests that are pending.
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
