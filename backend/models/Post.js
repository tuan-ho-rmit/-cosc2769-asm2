import mongoose from "mongoose";

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
});

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
