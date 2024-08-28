import User from "../models/user.js";
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

        // 사용자 ID로 사용자 정보 찾기 및 업데이트
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { firstName, lastName, avatar },
            { new: true } // 업데이트된 정보를 반환하도록 설정
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // 성공적으로 업데이트된 정보를 반환
        res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Failed to update profile', error: error.message });
    }
};

export const getUserDetails = async (req, res) => {
    const { userId } = req.params; // URL 파라미터에서 userId 추출

    console.log('Requested userId on server:', userId); // 서버에서 요청된 userId 출력

    try {
        // ObjectId 형식이 유효한지 확인
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            console.error('Invalid user ID format');
            return res.status(400).json({
                success: false,
                message: "Invalid user ID format",
            });
        }

        // userId로 사용자 찾기 and populate friendIds
        const user = await User.findById(userId).populate('friendIds', 'firstName lastName')

        // 사용자가 존재하지 않을 경우
        if (!user) {
            console.error('User not found in database');
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // 성공적으로 사용자 정보를 가져온 경우
        res.status(200).json({
            success: true,
            message: "Successfully fetched user details",
            data: user,
        });
    } catch (error) {
        // 오류 발생 시
        console.error('Error fetching user details:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching user details",
            error: error.message,
        });
    }
};

