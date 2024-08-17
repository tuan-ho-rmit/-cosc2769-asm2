import express from 'express';
import Post from '../models/Post.js';

const router = express.Router();

// Create a new post
router.post('/posts', async (req, res) => {
    const { text } = req.body;

    try {
        const newPost = new Post({ text });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create post' });
    }
});

// Get all posts
router.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

export default router;
