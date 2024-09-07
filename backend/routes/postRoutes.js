import express from 'express';
import Post from '../models/Post.js';
import mongoose from 'mongoose';
import Group from '../models/Group.js';
import User from '../models/User.js';
import { verifyAdmin } from '../util/verifyToken.js';


const router = express.Router();

// get post pagination
router.get('/posts/list', verifyAdmin, async (req, res) => {
    try {
        let { page, limit, search, searchType } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);

        const filter = {};
        if (search) {
            if (searchType === "author") {
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
                const regex = new RegExp(search, "i");
                filter.$or = [{ title: regex }, { content: regex }];
            } else if (searchType === "group") {
                const groupFilter = {
                    $or: [
                        { groupName: { $regex: search, $options: "i" } },
                    ],
                };
                const groups = await Group.find(groupFilter);
                const groupIds = groups.map((user) => user._id);
                filter.groupId = { $in: groupIds };
            } else {
                const regex = new RegExp(search, "i");
                filter.$or = [{ title: regex }, { content: regex }];
            }
        }

        const totalCount = await Post.countDocuments();
        const totalPages = (await Post.countDocuments(filter)) / limit;
        const posts = await Post.find(filter)
            .limit(limit)
            .skip((page - 1) * limit)
            .populate("author", "email")
            .populate("groupId", "groupName")
            .exec();

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

// 모든 Posts 불러오기
// router.get('/posts', async (req, res) => {
//     try {
//         // date 필드를 기준으로 내림차순 정렬하여 가장 최근의 포스트가 맨 위로 오도록 설정
//         const posts = await Post.find()
//             .sort({ date: -1 })  // 최신순으로 정렬
//             .populate('author', 'firstName lastName avatar')  // author 필드를 User의 firstName, lastName, avatar로 채움
//             .populate('userProfile', 'avatar');  // userProfile 필드도 필요하면 채움

//         res.status(200).json(posts);
//     } catch (error) {
//         console.error('Error fetching posts:', error);
//         res.status(500).json({ message: "Error fetching posts", error });
//     }
// });
// 모든 Posts 불러오기 (메인 화면용)

// 모든 Posts 불러오기 (메인 화면용)
router.get('/posts', async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({ message: 'User is not logged in' });
        }

        const userId = req.session.user.id;

        console.log(`Fetching posts for user ID: ${userId}`);

        // 1. 사용자가 가입한 그룹을 확인하기 위해 그룹 검색
        const groups = await Group.find({ members: new mongoose.Types.ObjectId(userId) });
        const userGroupIds = groups.map(group => group._id);

        console.log(`User is a member of groups: ${userGroupIds}`);

        // 2. 사용자와 친구인지 확인하기 위해 사용자 정보를 가져옴
        const user = await User.findById(userId).select('friendIds');
        const friendIds = user.friendIds.map(friendId => friendId.toString());

        console.log(`User's friends: ${friendIds}`);

        // 3. 그룹 게시글과 일반 게시글을 함께 가져오기
        const posts = await Post.find({
            $or: [
                { private: false, isGroupPost: false },  // 전체공개 게시물
                { private: true, author: { $in: friendIds } },  // 친구공개 게시물 (로그인한 유저의 친구만)
                { isGroupPost: true, groupId: { $in: userGroupIds } },  // 로그인한 사용자가 가입한 그룹의 게시물들
                { author: userId }  // 본인이 작성한 게시물
            ]
        })
            .sort({ date: -1 })  // 최신순으로 정렬
            .populate('author', 'firstName lastName avatar')  // author 필드를 User의 firstName, lastName, avatar로 채움
            .populate('userProfile', 'avatar')  // userProfile 필드도 필요하면 채움
            .populate('groupId', 'groupName avatar');  // 그룹 정보 추가

        console.log(`Fetched ${posts.length} posts for the user including group, public, friend-only, and own posts.`);
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: "Error fetching posts", error });
    }
});

// Create Post
router.post('/posts', async (req, res) => {
    try {
        // Check if user is logged in
        if (!req.session.user) {
            return res.status(401).json({ message: 'User is not logged in' });
        }

        // 디버깅 로그 추가
        console.log('Request body for new post:', req.body);

        const { content, images, private: isPrivate } = req.body;  // Extract the private field

        console.log('isPrivate received on server:', isPrivate);

        const newPost = new Post({
            content,
            userProfile: req.session.user.id,
            userId: req.session.user.id,
            author: req.session.user.id,
            images,
            date: new Date(),
            isGroupPost: false,
            private: isPrivate  // Assign it correctly here
        });

        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: "Error creating post", error });
    }
});



// Get a specific post by ID with populated user data
router.get('/posts/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'firstName lastName avatar')
            .populate('userProfile', 'avatar');
        res.status(200).json(post);
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ message: "Error fetching post", error });
    }
});


// 특정 포스트의 모든 reaction 가져오기
router.get('/posts/:postId/reactions/count', async (req, res) => {
    const { postId } = req.params; // URL에서 postId를 가져옴

    try {
        // 해당 postId에 대한 모든 reaction의 개수를 가져옵니다.
        const post = await Post.findById(postId).populate('reactions');

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

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

// Delete Post
router.delete('/posts/:id', async (req, res) => {
    try {
        const postId = req.params.id;

        // ObjectId가 유효한지 확인
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: "Invalid post ID" });
        }

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

// Update Post
// router.put('/posts/:id', async (req, res) => {
//     try {
//         const postId = req.params.id;
//         const { content, images } = req.body;

//         // ObjectId가 유효한지 확인
//         if (!mongoose.Types.ObjectId.isValid(postId)) {
//             return res.status(400).json({ message: "Invalid post ID" });
//         }

//         const updatedPost = await Post.findByIdAndUpdate(
//             postId,
//             { content, images, date: new Date() },  // 수정할 필드
//             { new: true }  // 수정된 데이터를 반환
//         );

//         if (!updatedPost) {
//             return res.status(404).json({ message: "Post not found" });
//         }

//         res.status(200).json(updatedPost);
//     } catch (error) {
//         console.error('Error updating post:', error);
//         res.status(500).json({ message: "Error updating post", error });
//     }
// });
// Update Post
// Update Post
router.put('/posts/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        const { content, images } = req.body;
        const userId = req.session.user.id;

        // ObjectId 유효성 체크
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: "Invalid post ID" });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // history 추가
        post.history.push({
            modifiedBy: userId,
            modifiedAt: new Date(),
            previousContent: post.content,
            previousImages: post.images
        });

        // 새로운 내용으로 업데이트
        post.content = content;
        post.images = images;
        post.date = new Date();

        await post.save();

        // 업데이트된 포스트를 groupId 정보까지 포함해서 다시 불러오기
        const updatedPost = await Post.findById(postId)
            .populate('author', 'firstName lastName avatar')  // 작성자 정보
            .populate('groupId', 'groupName avatar');  // 그룹 정보 populate 추가

        res.status(200).json(updatedPost);  // populate된 데이터 반환
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ message: "Error updating post", error });
    }
});

// Get Post History
router.get('/posts/:id/history', async (req, res) => {
    const { id: postId } = req.params;

    try {
        const post = await Post.findById(postId)
            .select('history')
            .populate('history.modifiedBy', 'firstName lastName avatar'); // 수정한 사용자 정보 추가

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json(post.history);
    } catch (error) {
        console.error('Error fetching post history:', error);
        res.status(500).json({ message: "Error fetching post history", error });
    }
});

// Read a Post
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


// Get posts by a specific user
router.get('/posts/user/:userId', async (req, res) => {
    try {
        const posts = await Post.find({ author: req.params.userId })
            .populate('author', 'firstName lastName avatar')
            .populate('userProfile', 'avatar')
            .populate('groupId', 'groupName avatar') // 그룹 정보
            .sort({ date: -1 });

        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching user posts:', error);
        res.status(500).json({ message: "Error fetching user posts", error });
    }
});

// group


export default router;
