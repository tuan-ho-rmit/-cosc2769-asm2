import express from 'express';
import Post from '../models/Post.js';
import mongoose from 'mongoose';
import Group from '../models/Group.js';
import User from '../models/User.js';
import { verifyAdmin } from '../util/verifyToken.js';

const router = express.Router();

// Get post pagination with filtering options like author, content, or group
router.get('/posts/list', verifyAdmin, async (req, res) => {
    try {
        let { page, limit, search, searchType } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);

        const filter = {};  // Initialize filter object for search criteria
        if (search) {
            if (searchType === "author") {
                // Search for posts by author
                const userFilter = {
                    $or: [
                        { username: { $regex: search, $options: "i" } },
                        { email: { $regex: search, $options: "i" } },
                    ],
                };
                const users = await User.find(userFilter);
                const userIds = users.map((user) => user._id);
                filter.author = { $in: userIds };
            } else if (searchType === "content") {
                // Search posts by title or content
                const regex = new RegExp(search, "i");
                filter.$or = [{ title: regex }, { content: regex }];
            } else if (searchType === "group") {
                // Search posts by group name
                const groupFilter = {
                    $or: [
                        { groupName: { $regex: search, $options: "i" } },
                    ],
                };
                const groups = await Group.find(groupFilter);
                const groupIds = groups.map((user) => user._id);
                filter.groupId = { $in: groupIds };
            } else {
                // Default search if no specific type is provided
                const regex = new RegExp(search, "i");
                filter.$or = [{ title: regex }, { content: regex }];
            }
        }
        // Get total number of posts and apply pagination
        const totalCount = await Post.countDocuments();
        const totalPages = (await Post.countDocuments(filter)) / limit;
        const posts = await Post.find(filter)
            .limit(limit)
            .skip((page - 1) * limit)
            .populate("author", "email")  // Populate author data
            .populate("groupId", "groupName")  // Populate group data
            .exec();

        // Respond with paginated posts and relevant metadata
        res.status(200).json({
            success: true,
            totalPages: Math.ceil(totalPages),
            totalCount: totalCount,
            message: "Successfully fetched posts",
            data: posts,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error. Please try again.",
        });
    }
})

// Fetch all posts for the main screen (public, group, or friend's posts)
router.get('/posts', async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({ message: 'User is not logged in' });
        }

        const userId = req.session.user.id;

        // Fetch groups the user has joined
        const groups = await Group.find({ members: new mongoose.Types.ObjectId(userId) });
        const userGroupIds = groups.map(group => group._id);

        console.log(`User is a member of groups: ${userGroupIds}`);

        // Get user's friend list
        const user = await User.findById(userId).select('friendIds');
        const friendIds = user.friendIds.map(friendId => friendId.toString());

        console.log(`User's friends: ${friendIds}`);

        // Fetch posts, either public, group-specific, or friends-only
        const posts = await Post.find({
            $or: [
                { private: false, isGroupPost: false },  // Public posts
                { private: true, author: { $in: friendIds } },  // Friends-only posts
                { isGroupPost: true, groupId: { $in: userGroupIds } },  // Group posts
                { author: userId }  // User's own posts
            ]
        })
            .sort({ date: -1 })  // Sort posts by date, latest first
            .populate('author', 'firstName lastName avatar')  // Populate author data
            .populate('userProfile', 'avatar')  // Populate user profile data if necessary
            .populate('groupId', 'groupName avatar');  // Populate group data

        console.log(`Fetched ${posts.length} posts for the user including group, public, friend-only, and own posts.`);
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: "Error fetching posts", error });
    }
});

// Create a new post
router.post('/posts', async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({ message: 'User is not logged in' });
        }

        console.log('Request body for new post:', req.body);

        const { content, images, private: isPrivate } = req.body;

        // Create a new post
        const newPost = new Post({
            content,
            userProfile: req.session.user.id,
            userId: req.session.user.id,
            author: req.session.user.id,
            images,
            date: new Date(),
            isGroupPost: false,
            private: isPrivate
        });

        // Save the post and return the newly created post data
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: "Error creating post", error });
    }
});

// Get a specific post by its ID and populate user data
router.get('/posts/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'firstName lastName avatar')  // Populate author data
            .populate('userProfile', 'avatar');  // Populate user profile data
        res.status(200).json(post);
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ message: "Error fetching post", error });
    }
});

// Get the reaction count for a specific post
router.get('/posts/:postId/reactions/count', async (req, res) => {
    const { postId } = req.params;

    try {
        // Find the post and count reactions
        const post = await Post.findById(postId).populate('reactions');

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Count reactions by type
        const reactionCounts = post.reactions.reduce((acc, reaction) => {
            acc[reaction.type] = (acc[reaction.type] || 0) + 1;
            return acc;
        }, {});

        res.status(200).json(reactionCounts);
    } catch (error) {
        console.error('Error fetching reaction count:', error);
        res.status(500).json({ message: "Error fetching reaction count", error });
    }
});

// Delete a post by its ID
router.delete('/posts/:id', async (req, res) => {
    try {
        const postId = req.params.id;

        // Validate the post ID
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: "Invalid post ID" });
        }

        // Find and delete the post
        const post = await Post.findByIdAndDelete(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ message: "Error deleting post", error });
    }
});

// Update a post by its ID
router.put('/posts/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        const { content, images } = req.body;
        const userId = req.session.user.id;

        // Validate post ID
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: "Invalid post ID" });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Add post history before updating
        post.history.push({
            modifiedBy: userId,
            modifiedAt: new Date(),
            previousContent: post.content,
            previousImages: post.images
        });

        // Update post with new content and images
        post.content = content;
        post.images = images;
        post.date = new Date();

        await post.save();

        // Return the updated post with populated group data
        const updatedPost = await Post.findById(postId)
            .populate('author', 'firstName lastName avatar')
            .populate('groupId', 'groupName avatar');

        res.status(200).json(updatedPost);
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ message: "Error updating post", error });
    }
});

// Get the modification history for a post
router.get('/posts/:id/history', async (req, res) => {
    const { id: postId } = req.params;

    try {
        const post = await Post.findById(postId)
            .select('history')  // Select only the history field
            .populate('history.modifiedBy', 'firstName lastName avatar');  // Populate modifier's data

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json(post.history);
    } catch (error) {
        console.error('Error fetching post history:', error);
        res.status(500).json({ message: "Error fetching post history", error });
    }
});

// Get posts for a specific user by their ID
router.get('/posts/user/:userId', async (req, res) => {
    try {
        const posts = await Post.find({ author: req.params.userId })
            .populate('author', 'firstName lastName avatar')  // Populate author data
            .populate('groupId', 'groupName avatar members')  // Populate group data
            .populate('userProfile', 'avatar')  // Populate user profile data
            .sort({ date: -1 });  // Sort posts by date

        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching user posts:', error);
        res.status(500).json({ message: "Error fetching user posts", error });
    }
});

// Read a Post
router.get('/posts/:id', async (req, res) => {
    try {
        const postId = req.params.id;

        // ObjectId가 유효한지 확인
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: "Invalid post ID" });
        }

        const post = await Post.findById(postId)
            .populate('author', 'firstName lastName avatar')  // 작성자의 firstName, lastName, avatar 포함
            .populate('groupId', 'groupName avatar');  // groupId 필드에 대해 populate 추가

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        console.log("Fetched post with populated groupId:", post); // 디버깅용 로그 추가

        res.status(200).json(post);
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ message: "Error fetching post", error });
    }
});

export default router;
