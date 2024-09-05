import mongoose from "mongoose";

const reactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['Like', 'Love', 'HaHa', 'Angry'], required: true }
});

const historySchema = new mongoose.Schema({
    modifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // 수정한 사용자
    modifiedAt: { type: Date, default: Date.now }, // 수정된 시간
    previousContent: String, // 수정 이전의 내용
    previousImages: [String] // 수정 이전의 이미지 배열
});

const postSchema = new mongoose.Schema({
    userProfile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },  // content 필드가 필수
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    images: [String],
    reactions: [reactionSchema],
    isGroupPost: {
        type: Boolean,
        default: false
    },
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: false
    },
    history: [historySchema],
},
    { timestamps: true }
);

// Populate author with firstName and lastName, and userProfile with avatar
postSchema.virtual('authorDetails', {
    ref: 'User',
    localField: 'author',
    foreignField: '_id',
    justOne: true,
    select: 'firstName lastName'
});

postSchema.virtual('userProfileDetails', {
    ref: 'User',
    localField: 'userProfile',
    foreignField: '_id',
    justOne: true,
    select: 'avatar'
});



const Post = mongoose.model('Post', postSchema);

export default Post;
