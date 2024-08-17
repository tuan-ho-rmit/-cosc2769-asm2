import express from 'express';
import Post from '../models/Post.js';
import mongoose from 'mongoose';
const router = express.Router();

// 모든 Posts 불러오기
router.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: "Error fetching posts", error });
    }
});

// Post 추가
router.post('/posts', async (req, res) => {
    try {
        const { content, author, images } = req.body;

        const newPost = new Post({
            content,
            author,
            images,
            date: new Date(),
        });

        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: "Error creating post", error });
    }
});
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

export default router;
