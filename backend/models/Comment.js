import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
  modifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // 수정한 사용자
  modifiedAt: { type: Date, default: Date.now }, // 수정된 시간
  previousContent: String, // 수정 이전의 내용
});

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
    history: [historySchema],
});

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;

