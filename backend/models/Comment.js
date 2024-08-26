import mongoose from "mongoose";

const reactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['Like', 'Love', 'HaHa', 'Angry'], required: true }
  });

const commentSchema = new mongoose.Schema({
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true }, // 댓글이 속한 게시글의 ID
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
    reactions: [reactionSchema],
});

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;

