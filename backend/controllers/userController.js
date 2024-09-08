import User from "../models/User.js";
import Group from "../models/Group.js";
import mongoose from 'mongoose';
// get List User
export const getListUser = async (req, res) => {
    try {
        let { page, limit, status, search, searchType, role } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);

        const filter = {};
        if (status) {
            filter.status = status;
        }
        if (role) {
            filter.role = role;
        }
        if (search) {
            if (searchType === "email") {
                filter.email = { $regex: search, $options: "i" };
            } else if (searchType === "username") {
                filter.username = { $regex: search, $options: "i" };
            } else {
                filter.$or = [
                    { username: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } },
                ];
            }
        }

        const totalCount = await User.countDocuments();
        const totalPages = (await User.countDocuments(filter)) / limit;
        const users = await User.find(filter)
            .limit(limit)
            .skip((page - 1) * limit);

        res.status(200).json({
            success: true,
            totalPages: Math.ceil(totalPages),
            totalCount: totalCount,
            message: "Successfully fetched users",
            data: users,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error. Please try again.",
        });
    }
};

export const getUserGroups = async (req, res) => {
    const { userId } = req.params;

    try {
        // find the group that user is participating
        const groups = await Group.find({ members: userId }).select('groupName avatar');
        
        if (!groups.length) {
            return res.status(404).json({ message: "No groups found for the user" });
        }

        res.status(200).json({ groups });
    } catch (error) {
        console.error('Error fetching user groups:', error);
        res.status(500).json({ message: "Error fetching user groups", error });
    }
};


// Deactivate user
export const deactivateUser = async (req, res) => {
    const id = req.params.id;
    try {
        const updatedUser = await User.findByIdAndUpdate(
            id,
            {
                $set: { status: "inactive" },
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Successfully locked user",
            data: updatedUser,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to lock user. Try again",
        });
    }
};

// Activate user
export const activateUser = async (req, res) => {
    const id = req.params.id;
    try {
        const updatedUser = await User.findByIdAndUpdate(
            id,
            {
                $set: { status: "active" },
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Successfully unlocked user",
            data: updatedUser,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to unlock user. Try again",
        });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const { id, firstName, lastName, avatar } = req.body;

        // find and update user info using user Id
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { firstName, lastName, avatar },
            { new: true } // return updated user info
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // when success
        res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Failed to update profile', error: error.message });
    }
};
export const getUserDetails = async (req, res) => {
    const { userId } = req.params;

    try {
        // check if its object Id 
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            console.error('Invalid user ID format');
            return res.status(400).json({
                success: false,
                message: "Invalid user ID format",
            });
        }

        // find user by userId and populate friendIds + select avatar
        const user = await User.findById(userId)
            .populate('friendIds', 'firstName lastName avatar') // 친구 목록의 firstName, lastName, avatar 가져오기
            .select('firstName lastName avatar email');   // 필요한 사용자 필드만 선택

        // if user doesn't excists
        if (!user) {
            console.error('User not found in database');
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // when success
        res.status(200).json({
            success: true,
            message: "Successfully fetched user details",
            data: user,
        });
    } catch (error) {
        // when unsuccess
        console.error('Error fetching user details:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching user details",
            error: error.message,
        });
    }
};
