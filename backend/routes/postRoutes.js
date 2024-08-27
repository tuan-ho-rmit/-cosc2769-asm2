import express from 'express';
import Post from '../models/Post.js';
import mongoose from 'mongoose';

const router = express.Router();

// 모든 Posts 불러오기
router.get('/posts', async (req, res) => {
    try {
        // date 필드를 기준으로 내림차순 정렬하여 가장 최근의 포스트가 맨 위로 오도록 설정
        const posts = await Post.find()
            .sort({ date: -1 })  // 최신순으로 정렬
            .populate('author', 'firstName lastName avatar')  // author 필드를 User의 firstName, lastName, avatar로 채움
            .populate('userProfile', 'avatar');  // userProfile 필드도 필요하면 채움
        
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: "Error fetching posts", error });
    }
});


// Create Post
router.post('/posts', async (req, res) => {
    try {
        // 세션에 저장된 유저 정보 확인
        if (!req.session.user) {
            return res.status(401).json({ message: 'User is not logged in' });
        }

        const { content, images } = req.body;

        const newPost = new Post({
            content,
            userProfile: req.session.user.id, // 유저의 ID를 세션에서 가져옴
            userId: req.session.user.id, // userId 필드에 유저의 ID 추가
            author: req.session.user.id, // author 필드에 유저의 ID 추가
            images,  // Base64 인코딩된 이미지 배열
            date: new Date(),
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
router.put('/posts/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        const { content, images } = req.body;

        // ObjectId가 유효한지 확인
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: "Invalid post ID" });
        }

        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { content, images, date: new Date() },  // 수정할 필드
            { new: true }  // 수정된 데이터를 반환
        );

        if (!updatedPost) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json(updatedPost);
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ message: "Error updating post", error });
    }
});


router.get('/posts/list', async (req, res) => {
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

        const totalCount = await Post.countDocuments();
        const totalPages = (await Post.countDocuments(filter)) / limit;
        const users = await Post.find(filter)
            .limit(limit)
            .skip((page - 1) * limit);

        res.status(200).json({
            success: true,
            totalPages: Math.ceil(totalPages),
            totalCount: totalCount,
            message: "Successfully fetched posts",
            data: users,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error. Please try again.",
        });
    }
})
// Read a Post
router.get('/posts/:id', async (req, res) => {
    try {
        const postId = req.params.id;

        // ObjectId가 유효한지 확인
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: "Invalid post ID" });
        }

        const post = await Post.findById(postId)
            .populate('author', 'firstName lastName avatar');  // 작성자의 firstName, lastName, avatar 포함

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

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
            .sort({ date: -1 });

        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching user posts:', error);
        res.status(500).json({ message: "Error fetching user posts", error });
    }
});

export default router;
