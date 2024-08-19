import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    userProfile: String,
    content: { type: String, required: true },  // content 필드가 필수
    author: { type: String, default: "Anonymous" },
    date: { type: Date, default: Date.now },
    images: [String],
});

const Post = mongoose.model('Post', postSchema);

export default Post;

